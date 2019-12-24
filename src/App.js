import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import timeago from "epoch-timeago";

const TimeAgo = ({ time }) => {
  return <time datetime={new Date(time).toISOString()}>{timeago(time)}</time>;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      icon: null,
      name: "",
      level: null,
      matches: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    console.log("button clicked and sent", this.state.username);
    axios
      .post("/summonerSearch", { username: this.state.username })
      .then(response => {
        console.log("response from backend", response.data);
        this.setState({
          icon: response.data.profileIconId,
          level: response.data.summonerLevel,
          name: response.data.name,
          accountId: response.data.accountId
        });

        return axios.post("/matchHistory", { accountId: this.state.accountId });
      })
      .then(response => {
        console.log("matchhistory", response.data);
        const matches = [];
        response.data.matches.forEach((element, index) => {
          let timeSince = new Date(element.timestamp);

          matches.push(
            <article key={index}>
              {element.lane}
              {element.champion}
              <TimeAgo time={timeSince} />
            </article>
          );
          console.log(new Date(element.timestamp));
        });
        this.setState({ matches });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  loadIcon(profileiconid) {
    return (
      <img
        src={`http://ddragon.leagueoflegends.com/cdn/6.3.1/img/profileicon/${profileiconid}.png`}
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
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter username"
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
          {this.state.name} {this.state.level} <div>{this.state.matches}</div>
        </Form>
      </div>
    );
  }
}

export default App;
