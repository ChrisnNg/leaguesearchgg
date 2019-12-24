import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { username: "", icon: null, name: "", level: null };

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
      .post("/api", { username: this.state.username })
      .then(response => {
        this.setState({
          icon: response.data.profileIconId,
          level: response.data.summonerLevel,
          name: response.data.name
        });
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
          {this.state.name ? this.loadIcon(this.state.icon) : null}
          {this.state.name} {this.state.level}{" "}
        </Form>
      </div>
    );
  }
}

export default App;
