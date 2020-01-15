import React, { Component } from "react";
import "./App.css";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Table,
  Container,
  Navbar
} from "react-bootstrap";
import axios from "axios";

import {
  itemsId,
  TimeAgo,
  championIder,
  mapIder,
  participantId,
  perkId,
  positionId,
  queueId,
  queueType,
  summonersId,
  teamId,
  Masteries,
  loadIcon
} from "./hooks/index";

import Footer from "./Footer.js";

import { withRouter } from "react-router-dom";

import FadeIn from "react-fade-in";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.REACT_APP_BACKEND_URL || "";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      icon: null,
      name: "",
      level: null,
      matches: null,
      leagues: { html: [], length: 0 },
      masteries: null,
      visibility: "show"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.summonerSearch = this.summonerSearch.bind(this);
    this.handleLanding = this.handleLanding.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleLanding() {
    this.summonerSearch(
      "crisang",
      false,
      this.setState({ visibility: "hide" })
    );
    this.props.history.push(`/crisang`);
  }

  summonerSearch(Summoner, check, cb) {
    if (check) {
      if (Summoner === this.state.username) {
        return null;
      }
    }

    //cb for setting visibility to false
    cb;

    this.props.location
      ? this.setState({
          username: Summoner,
          loading: true
        })
      : this.setState({ loading: true });

    decodeURI(Summoner);

    // console.log("submission", Summoner);
    axios
      .post(`${baseUrl}/summonerSearch`, {
        username: Summoner
      })
      .then(response => {
        // console.log("/summonerSearch", response.data);
        this.setState({
          icon: loadIcon(
            response.data.profileIconId,
            response.data.summonerLevel
          ),
          level: response.data.summonerLevel,
          name: response.data.name,
          accountId: response.data.accountId,
          summonerId: response.data.id
        });

        const getMatchHistory = axios.post(`${baseUrl}/matchHistory`, {
          accountId: this.state.accountId,
          summonerId: this.state.summonerId
        });
        const getLeagues = axios.post(`${baseUrl}/leagues`, {
          summonerId: this.state.summonerId
        });
        console.log(this.state.summonerId);
        const getMasteries = axios.post(`${baseUrl}/masteries`, {
          summonerId: this.state.summonerId
        });
        return axios.all([getMatchHistory, getLeagues, getMasteries]);
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(
        axios.spread((...responses) => {
          const responseMatches = responses[0].data;
          const responseLeagues = responses[1].data;
          const responseMasteries = responses[2].data;

          // console.log(responseLeagues);
          // console.log(responseMatches);
          // console.log("/masteries", responseMasteries);
          // console.log("/leagues", responseLeagues);

          const leagues = [];
          const matchCalls = [];

          responseMatches.matches.slice(0, 9).forEach((element, index) => {
            matchCalls.push(
              axios.post(`${baseUrl}/matchInfo`, { matchId: element.gameId })
            );
          });

          let leaguesLength = 0;
          let tier = null;
          responseLeagues.forEach((element, index) => {
            leaguesLength += 1;
            tier = element.tier;
            leagues.push(
              <article className="summoner-stats" key={index}>
                <Col md="auto">
                  <img
                    src={require(`./assets/ranked-emblems/Emblem_${element.tier.charAt(
                      0
                    ) + element.tier.toLowerCase().substr(1)}.png`)}
                    className="rankIcon"
                    alt={`${element.tier} Emblem`}
                  />
                </Col>
                <Col md="auto">
                  {element.tier} {element.rank} <br />
                  <i>{queueType(element.queueType)}</i> <br />
                  {element.freshBlood}
                  {element.hotStreak}
                  {element.veteran}
                  LP: {element.leaguePoints} <br />
                  W: {element.wins} - L: {element.losses} <br />
                </Col>
              </article>
            );
          });

          this.setState({
            matchList: responseMatches,
            leagues: { html: leagues, length: leaguesLength, tier },
            masteries: responseMasteries
          });

          return axios.all(matchCalls);
        })
      )
      .then(
        axios.spread((...responses) => {
          const matches = [];

          responses.forEach((element, index) => {
            let timeSince = new Date(
              this.state.matchList.matches[index].timestamp
            );
            // console.log("each match info", element.data);

            let playerInfo = participantId(
              this.state.matchList.matches[index].champion,
              element.data.participants
            );
            // console.log(playerInfo);

            if (!championIder(this.state.matchList.matches[index].champion)) {
              console.log("champion unable to be identified");
            } else {
              matches.push(
                <tr
                  key={index}
                  className={playerInfo.stats.win ? "Won" : "Lost"}
                >
                  <td className="td-queue">
                    {mapIder(element.data.mapId)}
                    <br />
                    <b>{queueId(this.state.matchList.matches[index].queue)}</b>

                    <br />
                    <TimeAgo time={timeSince} />
                    <hr />
                    <b
                      className={
                        playerInfo.stats.win ? "Won-Text" : "Lost-Text"
                      }
                    >
                      {playerInfo.stats.win ? "Victory" : "Defeat"}
                    </b>
                    <br />
                    {Math.floor(element.data.gameDuration / 60) +
                      "m " +
                      (element.data.gameDuration -
                        Math.floor(element.data.gameDuration / 60) * 60) +
                      "s"}
                  </td>
                  <td className="td-champ">
                    <Container>
                      <Row className="champ">
                        <Col className="empty">
                          {this.state.leagues.tier
                            ? positionId(
                                this.state.matchList.matches[index].lane,
                                this.state.matchList.matches[index].role,
                                this.state.leagues.tier
                              )
                            : null}
                        </Col>

                        <Col>
                          <Row className="vertical-align padding-top">
                            <img
                              src={require(`./assets/dragontail-9.24.2/img/champion/tiles/${
                                championIder(
                                  this.state.matchList.matches[index].champion
                                ).id
                              }_0.jpg`)}
                              className="champIcon"
                              alt={
                                championIder(
                                  this.state.matchList.matches[index].champion
                                ).id
                              }
                            />
                          </Row>
                          <Row className="text-center">
                            <p>
                              {
                                championIder(
                                  this.state.matchList.matches[index].champion
                                ).id
                              }
                            </p>
                          </Row>
                        </Col>
                        <Col>
                          <Row className="perks-container">
                            {summonersId(playerInfo.spell1Id)}
                            {summonersId(playerInfo.spell2Id)}
                          </Row>
                          <Row>
                            {perkId({
                              primary: playerInfo.stats.perkPrimaryStyle,
                              slot1: playerInfo.stats.perk0
                            })}
                            {perkId({ primary: playerInfo.stats.perkSubStyle })}
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </td>
                  <td
                    className={
                      "td-score " + (playerInfo.stats.win ? "Won" : "Lost")
                    }
                  >
                    Level: {playerInfo.stats.champLevel}
                    <br />
                    <b>
                      <span className="Won-Text">{playerInfo.stats.kills}</span>{" "}
                      /{" "}
                      <span className="Lost-Text">
                        {playerInfo.stats.deaths}
                      </span>{" "}
                      / {playerInfo.stats.assists}
                    </b>
                    <br />
                    KDA:{" "}
                    <b>
                      {playerInfo.stats.deaths ? (
                        <span
                          className={
                            (
                              (playerInfo.stats.kills +
                                playerInfo.stats.assists) /
                              playerInfo.stats.deaths
                            ).toFixed(2) >= 3
                              ? "Great-Text"
                              : null
                          }
                        >
                          {(
                            (playerInfo.stats.kills +
                              playerInfo.stats.assists) /
                            playerInfo.stats.deaths
                          ).toFixed(2)}
                        </span>
                      ) : (
                        "Perfect"
                      )}
                    </b>{" "}
                    <br />
                    CS:{" "}
                    {playerInfo.stats.totalMinionsKilled +
                      playerInfo.stats.neutralMinionsKilled}
                    <br />
                    Vision Score: {playerInfo.stats.visionScore}
                  </td>
                  <td
                    className={
                      "td-items " + (playerInfo.stats.win ? "Won" : "Lost")
                    }
                  >
                    {itemsId(playerInfo.stats)}
                  </td>
                  <td
                    className={
                      "td-team " + (playerInfo.stats.win ? "Won" : "Lost")
                    }
                  >
                    Teams:
                    <div className="teams">{teamId(element.data)}</div>
                  </td>
                </tr>
              );
            }
          });

          this.setState({ matches, loading: false });

          setTimeout(
            function() {
              this.setState({ visibility: "show" });
            }.bind(this),
            0
          );
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("compoent recieved new props");
    // console.log(nextProps);
    if (nextProps.location.state) {
      if (nextProps.location.state.summonerName) {
        if (this.props.location.pathname.substr(1)) {
          this.summonerSearch(
            nextProps.location.state.summonerName,
            this.setState({ visibility: "hide" })
          );
        }
      }
    }
  }
  componentDidMount() {
    // console.log("mounted");
    if (this.props.location.pathname.substr(1)) {
      this.summonerSearch(this.props.location.pathname.substr(1), true);
    }
  }

  handleSubmit() {
    event.preventDefault();

    if (!this.state.username) {
      return toast("Please enter a summoner name!", {
        position: toast.POSITION.TOP_CENTER,
        className: "toastera"
      });
    }

    this.props.history.push(`/${this.state.username}`);

    this.summonerSearch(
      this.state.username,
      false,
      this.setState({ visibility: "hide" })
    );
  }

  render() {
    return (
      <div className={(this.state.matches ? "App-height" : null) + " App"}>
        <Navbar fixed="top" bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              src={require("./assets/Rengar_Plush_In_The_Jungle_icon.png")}
              className="nav-logo"
              alt="logo"
            />
            <span className="app-title">LeagueSearch.GG</span>
          </Navbar.Brand>
          <Form inline className="form-search">
            <Form.Control
              required
              type="search"
              placeholder="Summoner Name"
              onChange={this.handleChange}
            />

            <Button
              variant="outline-info"
              type="submit"
              className={"form-button"}
              onClick={this.handleSubmit.bind(this)}
            >
              {" "}
              {!this.state.loading ? (
                "Submit"
              ) : (
                <React.Fragment>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </React.Fragment>
              )}
            </Button>
          </Form>
        </Navbar>
        <ToastContainer />
        {!this.props.location.pathname.substr(1) ? (
          <FadeIn className={"landing " + this.state.visibility}>
            <img
              src={require("./assets/teemo-logo.jpg")}
              className="App-logo"
              alt="logo"
            />

            <h2>Welcome to Chris' League of Legends Summoner Search site!</h2>
            <p>To begin, search up a summoner name.</p>
            <Button variant="outline-info" onClick={this.handleLanding}>
              Here's one to get you started
            </Button>
          </FadeIn>
        ) : null}

        {this.state.name && this.state.matches ? (
          <section className="summoner">
            <FadeIn className={this.state.visibility}>
              {this.state.icon}

              {this.state.level ? (
                <span className={"level-text " + this.state.visibility}>
                  Level: {this.state.level}
                </span>
              ) : null}

              {this.state.name ? (
                <b className={"name " + this.state.visibility}>
                  {this.state.name}
                </b>
              ) : null}
              <br />
            </FadeIn>
          </section>
        ) : null}

        <section
          className={
            (this.state.leagues["length"] === 1
              ? "single summoner "
              : "centered summoner ") + this.state.visibility
          }
        >
          {this.state.leagues.html && this.state.matches ? (
            <FadeIn>
              <Row>{this.state.leagues.html}</Row>
            </FadeIn>
          ) : null}
        </section>

        {this.state.matches ? (
          <h4 className={"summoner " + this.state.visibility}>Recent Games</h4>
        ) : null}

        <section
          className={"matchHistory text-center " + this.state.visibility}
        >
          {this.state.matches ? (
            <FadeIn>
              <Table className="matches">
                <tbody>{this.state.matches}</tbody>
              </Table>
            </FadeIn>
          ) : null}
        </section>

        <section
          className={"mastery-container text-left " + this.state.visibility}
        >
          {this.state.masteries && this.state.matches ? (
            <FadeIn>
              <Table hover variant="dark">
                <thead>
                  <tr>
                    <th colSpan="2" className="text-center">
                      Champion Mastery
                    </th>
                  </tr>
                </thead>
                <tbody>{Masteries(this.state.masteries)}</tbody>
              </Table>
            </FadeIn>
          ) : null}
        </section>
        <Footer
          className={
            !this.props.location.pathname.substr(1) ? "landing-footer" : ""
          }
        />
      </div>
    );
  }
}

export default withRouter(App);
