import React, { Component, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Table,
  Container
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

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  withRouter,
  useHistory
} from "react-router-dom";

import FadeIn from "react-fade-in";

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
      masteries: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  componentDidMount() {
    console.log("mounted");
    if (this.props.location.pathname.substr(1)) {
      // this.handleSubmit();
      this.props.location
        ? this.setState({
            username: this.props.location.pathname.substr(1),
            loading: true
          })
        : this.setState({ loading: true });

      console.log("submission", this.props.location.pathname.substr(1));
      axios
        .post(`${baseUrl}/summonerSearch`, {
          username: this.props.location.pathname.substr(1)
        })
        .then(response => {
          console.log("/summonerSearch", response.data);
          this.setState({
            icon: response.data.profileIconId,
            level: response.data.summonerLevel,
            name: response.data.name,
            accountId: response.data.accountId,
            summonerId: response.data.id,
            loading: false
          });

          const getMatchHistory = axios.post(`${baseUrl}/matchHistory`, {
            accountId: this.state.accountId,
            summonerId: this.state.summonerId
          });
          const getLeagues = axios.post(`${baseUrl}/leagues`, {
            summonerId: this.state.summonerId
          });
          const getMasteries = axios.post(`${baseUrl}/masteries`, {
            summonerId: this.state.summonerId
          });
          return axios.all([getMatchHistory, getLeagues, getMasteries]);
        })
        .then(
          axios.spread((...responses) => {
            const responseMatches = responses[0].data;
            const responseLeagues = responses[1].data;
            const responseMasteries = responses[2].data;

            // console.log(responseLeagues);
            // console.log(responseMatches);
            console.log(responseMasteries);

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
                <article key={index}>
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
              console.log("each match info", element.data);

              let playerInfo = participantId(
                this.state.matchList.matches[index].champion,
                element.data.participants
              );
              console.log(playerInfo);

              matches.push(
                <tr
                  key={index}
                  className={playerInfo.stats.win ? "Won" : "Lost"}
                >
                  <td>
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
                  <td>
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
                  <td>
                    Level: {playerInfo.stats.champLevel}
                    <br />
                    <b>
                      {playerInfo.stats.kills} /{" "}
                      <span className="Lost-Text">
                        {playerInfo.stats.deaths}
                      </span>{" "}
                      / {playerInfo.stats.assists}
                    </b>
                    <br />
                    KDA:{" "}
                    <b>
                      {playerInfo.stats.deaths
                        ? (
                            (playerInfo.stats.kills +
                              playerInfo.stats.assists) /
                            playerInfo.stats.deaths
                          ).toFixed(2)
                        : "Perfect"}
                    </b>{" "}
                    KDA
                    <br />
                    CS:{" "}
                    {playerInfo.stats.totalMinionsKilled +
                      playerInfo.stats.neutralMinionsKilled}
                    <br />
                    Vision Score: {playerInfo.stats.visionScore}
                  </td>
                  <td>{itemsId(playerInfo.stats)}</td>
                  <td className="td-team">
                    Teams:
                    <div className="teams">{teamId(element.data)}</div>
                  </td>
                </tr>
              );
            });

            this.setState({ matches, loading: false });
          })
        )
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  handleSubmit() {
    event.preventDefault();

    this.props.location
      ? this.setState({
          username: this.props.location.pathname.substr(1),
          loading: true
        })
      : this.setState({ loading: true });

    console.log("submission", this.props.location.pathname.substr(1));
    axios
      .post(`${baseUrl}/summonerSearch`, {
        username: this.state.username
      })
      .then(response => {
        // console.log("/summonerSearch", response.data);
        this.setState({
          icon: response.data.profileIconId,
          level: response.data.summonerLevel,
          name: response.data.name,
          accountId: response.data.accountId,
          summonerId: response.data.id,
          loading: false
        });

        const getMatchHistory = axios.post(`${baseUrl}/matchHistory`, {
          accountId: this.state.accountId,
          summonerId: this.state.summonerId
        });
        const getLeagues = axios.post(`${baseUrl}/leagues`, {
          summonerId: this.state.summonerId
        });
        const getMasteries = axios.post(`${baseUrl}/masteries`, {
          summonerId: this.state.summonerId
        });
        return axios.all([getMatchHistory, getLeagues, getMasteries]);
      })
      .then(
        axios.spread((...responses) => {
          const responseMatches = responses[0].data;
          const responseLeagues = responses[1].data;
          const responseMasteries = responses[2].data;

          // console.log(responseLeagues);
          // console.log(responseMatches);
          console.log(responseMasteries);

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
              <article key={index}>
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
            console.log("each match info", element.data);

            let playerInfo = participantId(
              this.state.matchList.matches[index].champion,
              element.data.participants
            );
            console.log(playerInfo);

            matches.push(
              <tr key={index} className={playerInfo.stats.win ? "Won" : "Lost"}>
                <td>
                  {mapIder(element.data.mapId)}
                  <br />
                  <b>{queueId(this.state.matchList.matches[index].queue)}</b>

                  <br />
                  <TimeAgo time={timeSince} />
                  <hr />
                  <b
                    className={playerInfo.stats.win ? "Won-Text" : "Lost-Text"}
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
                <td>
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
                <td>
                  Level: {playerInfo.stats.champLevel}
                  <br />
                  <b>
                    {playerInfo.stats.kills} /{" "}
                    <span className="Lost-Text">{playerInfo.stats.deaths}</span>{" "}
                    / {playerInfo.stats.assists}
                  </b>
                  <br />
                  KDA:{" "}
                  <b>
                    {playerInfo.stats.deaths
                      ? (
                          (playerInfo.stats.kills + playerInfo.stats.assists) /
                          playerInfo.stats.deaths
                        ).toFixed(2)
                      : "Perfect"}
                  </b>{" "}
                  KDA
                  <br />
                  CS:{" "}
                  {playerInfo.stats.totalMinionsKilled +
                    playerInfo.stats.neutralMinionsKilled}
                  <br />
                  Vision Score: {playerInfo.stats.visionScore}
                </td>
                <td>{itemsId(playerInfo.stats)}</td>
                <td className="td-team">
                  Teams:
                  <div className="teams">{teamId(element.data)}</div>
                </td>
              </tr>
            );
          });

          this.setState({ matches, loading: false });
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            Welcome to {this.props ? console.log(this.props.location) : null}}
          </h2>
        </div>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label className="summoner">Summoner Name</Form.Label>
            <Form.Control
              type="search"
              placeholder="Enter Summoner Name"
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your information with anyone else.
            </Form.Text>
          </Form.Group>
          <Button type="submit" onClick={this.handleSubmit.bind(this)}>
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

          {this.state.name && this.state.matches ? (
            <section className="summoner">
              <FadeIn>
                {loadIcon(this.state.icon)}
                <br />
                {this.state.name ? this.state.name : null}
                <br />
                {this.state.level ? `Level: ${this.state.level}` : null}
              </FadeIn>
            </section>
          ) : null}

          <section
            className={
              this.state.leagues["length"] === 1
                ? "single summoner"
                : "centered summoner"
            }
          >
            {this.state.leagues.html && this.state.matches ? (
              <FadeIn>
                <Row>{this.state.leagues.html}</Row>
              </FadeIn>
            ) : null}
          </section>

          {this.state.matches ? (
            <h4 className="summoner">Recent Games</h4>
          ) : null}

          <section className="matchHistory text-center">
            {this.state.matches ? (
              <FadeIn>
                <Table>
                  <tbody>{this.state.matches}</tbody>
                </Table>
              </FadeIn>
            ) : null}
          </section>

          <section className="mastery-container text-left">
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
        </Form>
      </div>
    );
  }
}

export default withRouter(App);
