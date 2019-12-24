import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import TimeAgo from "./hooks/epochToTime.js";
import championIder from "./hooks/championID.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      icon: null,
      name: "",
      level: null,
      matches: [],
      leagues: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.moreInfo = this.moreInfo.bind(this);
  }
  moreInfo(event) {
    console.log(event);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();

    console.log("submission");
    axios
      .post("/summonerSearch", { username: this.state.username })
      .then(response => {
        console.log("/summonerSearch", response.data);
        this.setState({
          icon: response.data.profileIconId,
          level: response.data.summonerLevel,
          name: response.data.name,
          accountId: response.data.accountId,
          summonerId: response.data.id
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
          const responseLeagues = responses[1];

          console.log(responseLeagues);
          console.log(responseMatches);
          const matches = [];
          const leagues = [];
          const matchCalls = [];

          responseMatches.matches.slice(0, 3).forEach((element, index) => {
            let timeSince = new Date(element.timestamp);
            matchCalls.push(
              axios.post("/matchInfo", { matchId: element.gameId })
            );

            matches.push(
              <article key={index}>
                {element.lane}
                {championIder(element.champion).id}
                <img
                  src={require(`./assets/dragontail-9.24.2/img/champion/tiles/${
                    championIder(element.champion).id
                  }_0.jpg`)}
                  className="champIcon"
                  alt={championIder(element.champion).id}
                />
                {element.role}
                Time:
                <TimeAgo time={timeSince} />
              </article>
            );
          });

          responseLeagues.data.forEach((element, index) => {
            leagues.push(
              <article key={index}>
                {element.freshBlood}
                {element.hotStreak}
                {element.veteran}
                LP: {element.leaguePoints}
                W: {element.wins}
                L: {element.losses}
                Type: {element.queueType}
                Tier: {element.tier}
                <img
                  src={require(`./assets/ranked-emblems/Emblem_${element.tier.charAt(
                    0
                  ) + element.tier.toLowerCase().substr(1)}.png`)}
                  className="champIcon"
                  alt={`${element.tier} Emblem`}
                />
                Rank: {element.rank}
                LeagueID: {element.leagueId}
              </article>
            );
          });

          this.setState({ matches, leagues });
          console.log("current match state", matchCalls);
          return axios.all(matchCalls);
        })
      )
      .then(
        axios.spread((...responses) => {
          console.log("final", responses);
          const matches = [];

          responses.forEach((element, index) => {
            console.log(element, index);
            matches.push(
              <article key={index}>
                Length: {element.data.gameDuration}
                gameMode: {element.data.gameMode}
                gameType: {element.data.gameType}
                mapId: {element.data.mapId}
                teams: dig into array
              </article>
            );
            this.setState({ matchInfo: matches });
          });
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
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            onClick={this.handleSubmit.bind(this)}
          >
            Submit
          </Button>
          <section>
            {this.state.name ? this.loadIcon(this.state.icon) : null}
          </section>
          {this.state.name} {this.state.level}
          <div>{this.state.leagues}</div>
          <div>{this.state.matches}</div>
          <div>{this.state.matchInfo}</div>
        </Form>
      </div>
    );
  }
}

export default App;
