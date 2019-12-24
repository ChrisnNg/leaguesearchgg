// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const path = require("path");
var qs = require("qs");
const axios = require("axios");
// PG database client/connection setup

// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "build")));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({ test: true });
});

app.post("/api", (req, res) => {
  let summoner = req.body.username;

  var authOptions = {
    method: "GET",
    url: `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
    headers: {
      Origin: "https://developer.riotgames.com",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Riot-Token": process.env.API_KEY,
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36"
    },
    json: true
  };

  axios(authOptions)
    .then(function(response) {
      // console.log(response.data);

      let accountId = response.data.accountId;
      var matchHistory = {
        method: "GET",
        url: `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`,
        headers: {
          Origin: "https://developer.riotgames.com",
          "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Riot-Token": process.env.API_KEY,
          "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36"
        },
        json: true
      };

      return axios(matchHistory);
      res.send(response.data);
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
