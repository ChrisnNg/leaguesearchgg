import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form, Button, Row, Col, Spinner, Table } from "react-bootstrap";
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
  teamId
} from "./hooks/index";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      icon: null,
      name: "",
      level: null,
      matches: [],
      leagues: { html: [], length: 0 }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();

    this.setState({ loading: true });
    console.log("submission");
    axios
      .post("/summonerSearch", { username: this.state.username })
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

        const getMatchHistory = axios.post("/matchHistory", {
          accountId: this.state.accountId,
          summonerId: this.state.summonerId
        });
        const getLeagues = axios.post("/leagues", {
          accountId: this.state.accountId,
          summonerId: this.state.summonerId
        });
        return axios.all([getMatchHistory, getLeagues]);
      })
      .then(
        axios.spread((...responses) => {
          const responseMatches = responses[0].data;
          const responseLeagues = responses[1].data;

          // console.log(responseLeagues);
          console.log(responseMatches);
          const leagues = [];
          const matchCalls = [];

          responseMatches.matches.slice(0, 9).forEach((element, index) => {
            matchCalls.push(
              axios.post("/matchInfo", { matchId: element.gameId })
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
            leagues: { html: leagues, length: leaguesLength, tier }
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
                  <Row className="champ">
                    <Col className="empty">
                      {positionId(
                        this.state.matchList.matches[index].lane,
                        this.state.matchList.matches[index].role,
                        this.state.leagues.tier
                      )}
                    </Col>

                    <Col>
                      <Row className="vertical-align">
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

  loadIcon(profileiconid) {
    return (
      <img
        src={`http://ddragon.leagueoflegends.com/cdn/9.24.2/img/profileicon/${profileiconid}.png`}
        alt="new"
      />
    );
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Summoner Name</Form.Label>
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
          <section>
            {this.state.name ? this.loadIcon(this.state.icon) : null}
            <br />
            {this.state.name} <br />
            {this.state.level ? `Level: ${this.state.level}` : null}
          </section>

          <section
            className={
              this.state.leagues["length"] === 1 ? "single" : "centered"
            }
          >
            <Row>{this.state.leagues.html}</Row>
          </section>

          {this.state.name ? <h4>Recent Games</h4> : null}
          <section className="matchHistory text-center">
            <Table bordered>
              <tbody>{this.state.matches}</tbody>
            </Table>
          </section>
        </Form>
      </div>
    );
  }
}

export default App;
