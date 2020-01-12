import React from "react";
import timeago from "epoch-timeago";
import champions from "../assets/dragontail-9.24.2/9.24.2/data/en_US/champion.json";
import map from "../assets/dragontail-9.24.2/9.24.2/data/en_US/map.json";
import perks from "../assets/dragontail-9.24.2/9.24.2/data/en_US/runesReforged.json";
import queue from "../assets/queues.json";
import summoners from "../assets/summoners.json";
import { Row, Col, Button } from "react-bootstrap";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

const itemsId = function(playerStats) {
  return (
    <Col className="ItemsBracket">
      <Row>
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item0}.png`)}
          className="itemIcon"
          alt="Item0"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item1}.png`)}
          className="itemIcon"
          alt="Item1"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item2}.png`)}
          className="itemIcon"
          alt="Item2"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item3}.png`)}
          className="itemIcon"
          alt="Item3"
        />
      </Row>
      <Row>
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item4}.png`)}
          className="itemIcon"
          alt="Item4"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item5}.png`)}
          className="itemIcon"
          alt="Item5"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item6}.png`)}
          className="itemIcon"
          alt="Item6"
        />
        <img
          src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/item.png`)}
          className="itemIcon"
          alt="ItemIcon"
        />
      </Row>
    </Col>
  );
};

const championIder = function(champID) {
  for (const key in champions.data) {
    if (champions.data[key]["key"] === champID.toString()) {
      return champions.data[key];
    }
  }
};

/* have accesss to 

blurb: "Once honored defenders of Shurima against the Void, Aatrox and his brethren would eventually become an even greater threat to Runeterra, and were defeated only by cunning mortal sorcery. But after centuries of imprisonment, Aatrox was the first to find..."
id: "Aatrox"
image: {full: "Aatrox.png", sprite: "champion0.png", group: "champion", x: 0, y: 0, …}
info: {attack: 8, defense: 4, magic: 3, difficulty: 4}
key: "266"
name: "Aatrox"
partype: "Blood Well"
stats: {hp: 580, hpperlevel: 90, mp: 0, mpperlevel: 0, movespeed: 345, …}
tags: (2) ["Fighter", "Tank"]
title: "the Darkin Blade"
version: "9.24.2"

*/

const TimeAgo = ({ time }) => {
  return <time dateTime={new Date(time).toISOString()}>{timeago(time)}</time>;
};

const mapIder = function(mapId) {
  for (const key in map.data) {
    if (map.data[key].MapId === mapId.toString()) {
      return map.data[key].MapName;
    }
  }
  return "unidentified";
};

const participantId = function(championId, participantArray) {
  for (const player of participantArray) {
    if (player.championId === championId) {
      // console.log("element from participant id hook", player);
      return player;
    }
  }
  return "unidentified";
};

/*
Access to information:
championId: 92
participantId: 1
spell1Id: 4
spell2Id: 12
stats:
assists: 3
champLevel: 14
combatPlayerScore: 0
damageDealtToObjectives: 1258
damageDealtToTurrets: 1258
damageSelfMitigated: 22457
deaths: 10
doubleKills: 0
firstBloodAssist: false
firstBloodKill: false
firstInhibitorAssist: false
firstInhibitorKill: false
firstTowerAssist: false
firstTowerKill: false
goldEarned: 8651
goldSpent: 8350
inhibitorKills: 0
item0: 3071
item1: 3812
item2: 3111
item3: 1033
item4: 1036
item5: 0
item6: 3340
killingSprees: 1
kills: 4
largestCriticalStrike: 0
largestKillingSpree: 2
largestMultiKill: 1
longestTimeSpentLiving: 590
magicDamageDealt: 0
magicDamageDealtToChampions: 0
magicalDamageTaken: 12496
neutralMinionsKilled: 4
neutralMinionsKilledEnemyJungle: 0
neutralMinionsKilledTeamJungle: 4
objectivePlayerScore: 0
participantId: 1
pentaKills: 0
perk0: 8010
perk0Var1: 360
perk0Var2: 0
perk0Var3: 0
perk1: 9111
perk1Var1: 618
perk1Var2: 140
perk1Var3: 0
perk2: 9104
perk2Var1: 22
perk2Var2: 30
perk2Var3: 0
perk3: 8299
perk3Var1: 354
perk3Var2: 0
perk3Var3: 0
perk4: 8304
perk4Var1: 10
perk4Var2: 3
perk4Var3: 0
perk5: 8347
perk5Var1: 0
perk5Var2: 0
perk5Var3: 0
perkPrimaryStyle: 8000
perkSubStyle: 8300
physicalDamageDealt: 69258
physicalDamageDealtToChampions: 9937
physicalDamageTaken: 12107
playerScore0: 0
playerScore1: 0
playerScore2: 0
playerScore3: 0
playerScore4: 0
playerScore5: 0
playerScore6: 0
playerScore7: 0
playerScore8: 0
playerScore9: 0
quadraKills: 0
sightWardsBoughtInGame: 0
statPerk0: 5008
statPerk1: 5008
statPerk2: 5002
timeCCingOthers: 17
totalDamageDealt: 69258
totalDamageDealtToChampions: 9937
totalDamageTaken: 25755
totalHeal: 2690
totalMinionsKilled: 131
totalPlayerScore: 0
totalScoreRank: 0
totalTimeCrowdControlDealt: 103
totalUnitsHealed: 1
tripleKills: 0
trueDamageDealt: 0
trueDamageDealtToChampions: 0
trueDamageTaken: 1151
turretKills: 0
unrealKills: 0
visionScore: 9
visionWardsBoughtInGame: 0
wardsKilled: 1
wardsPlaced: 7
win: false
*/

const perkId = function(perkId) {
  for (const element of perks) {
    if (element["id"] === perkId.primary) {
      if (perkId.slot1) {
        for (const perk of element.slots) {
          for (const element of perk.runes) {
            if (element.id === perkId.slot1) {
              return (
                <img
                  src={require(`../assets/dragontail-9.24.2/img/${element.icon}`)}
                  className="perkIcon"
                  alt="summonerSpell"
                />
              );
            }
          }
        }
      }
      return (
        <img
          src={require(`../assets/dragontail-9.24.2/img/${element.icon}`)}
          className="perkIcon"
          alt="summonerSpell"
        />
      );
    }
  }

  return perkId;
};

const positionId = function(lane, role, currentRank) {
  let tier =
    currentRank.charAt(0).toUpperCase() + currentRank.toLowerCase().substr(1);

  let img = function(tier, role) {
    return (
      <img
        src={require(`../assets/ranked-positions/Position_${tier}-${role}.png`)}
        className="position"
        alt="Position"
      />
    );
  };

  if (lane === "BOTTOM" && role === "DUO_CARRY") {
    return img(tier, "Bot");
  }

  if (lane === "TOP") {
    return img(tier, "Top");
  }

  if (lane === "MID") {
    return img(tier, "Mid");
  }

  if (lane === "JUNGLE") {
    return img(tier, "Jungle");
  }

  if (role === "DUO_SUPPORT" || role === "SOLO") {
    return img(tier, "Support");
  }
  if (role === "DUO") {
    return img(tier, "Bot");
  }
};

const queueId = function(queueId) {
  for (const element of queue) {
    if (element.queueId === queueId) {
      return element.description.slice(0, -5);
    }
  }
  return "unidentified";
};

const queueType = function(queue) {
  switch (queue) {
    case "RANKED_SOLO_5x5":
      return "Solo Queue";
    case "RANKED_FLEX_SR":
      return "Flex Queue";
    default:
      return "unidentified";
  }
};

const summonersId = function(summonerId) {
  for (const element of summoners) {
    if (element.key === summonerId.toString()) {
      return (
        <img
          src={require(`../assets/summoners/${element.name
            .charAt(0)
            .toUpperCase() + element.name.substr(1)}.png`)}
          className="summonerIcon"
          alt="summonerSpell"
        />
      );
    }
  }
  return "unidentified";
};

const teamId = function(matchData) {
  let team1 = [];
  let team2 = [];
  let participantsObj = {};

  for (const player of matchData.participantIdentities) {
    participantsObj[player.participantId] = {
      name: player.player.summonerName
    };
  }
  for (const player of matchData.participants) {
    participantsObj[player.participantId]["championId"] = player.championId;
  }

  for (const player in participantsObj) {
    if (parseInt(player, 10) < 6) {
      team1.push(
        <Row index={player.toString()}>
          <img
            src={require(`../assets/dragontail-9.24.2/img/champion/tiles/${
              championIder(participantsObj[player].championId).id
            }_0.jpg`)}
            className="champIcon-mini"
            alt={championIder(participantsObj[player].championId).id}
          />
          <Link
            to={{
              pathname: `/${participantsObj[player].name}`,
              state: { summonerName: participantsObj[player].name }
            }}
            className="team-click"
          >
            {participantsObj[player].name}
          </Link>
        </Row>
      );
    } else {
      team2.push(
        <Row index={player.toString()}>
          <img
            src={require(`../assets/dragontail-9.24.2/img/champion/tiles/${
              championIder(participantsObj[player].championId).id
            }_0.jpg`)}
            className="champIcon-mini"
            alt={championIder(participantsObj[player].championId).id}
          />
          <Link
            to={{
              pathname: `/${participantsObj[player].name}`,
              state: { summonerName: participantsObj[player].name }
            }}
            className="team-click"
          >
            {participantsObj[player].name}
          </Link>
        </Row>
      );
    }
  }

  return (
    <Row className="text-center">
      <Col>{team1}</Col>
      <Col>{team2}</Col>
    </Row>
  );
};

const Masteries = function(arrayOfObjects) {
  const html = [];
  let count = 0;
  for (const mastery of arrayOfObjects) {
    html.push(
      <tr key={count}>
        <td>
          <img
            src={require(`../assets/dragontail-9.24.2/9.24.2/img/champion/${
              championIder(mastery.championId).id
            }.png`)}
            className="champIcon-mastery"
            alt={championIder(mastery.championId).id}
          />
        </td>
        <td>
          <Row>Level: {mastery.championLevel}</Row>
          <Row>Mastery Points: {mastery.championPoints}</Row>
          <Row>
            Last played:
            <TimeAgo time={mastery.lastPlayTime} />
          </Row>
        </td>
      </tr>
    );
    count += 1;
    if (count === 11) {
      break;
    }
  }
  return html;
};

const loadIcon = function(profileiconid, level) {
  let summonerLevel = 29;
  if (level <= 300) {
    summonerLevel = 300;
  }
  if (level <= 299) {
    summonerLevel = 299;
  }
  if (level < 249) {
    summonerLevel = 249;
  }
  if (level < 199) {
    summonerLevel = 199;
  }
  if (level < 174) {
    summonerLevel = 174;
  }
  if (level < 149) {
    summonerLevel = 149;
  }
  if (level < 124) {
    summonerLevel = 124;
  }
  if (level < 99) {
    summonerLevel = 99;
  }
  if (level < 74) {
    summonerLevel = 74;
  }
  if (level < 49) {
    summonerLevel = 49;
  }
  if (level < 29) {
    summonerLevel = 29;
  }
  return (
    <React.Fragment>
      <img
        src={`http://ddragon.leagueoflegends.com/cdn/9.24.2/img/profileicon/${profileiconid}.png`}
        alt="Summoner-Pfp"
        className="Summoner-Pfp"
      />
      <br />
      <img
        src={require(`../assets/summoner-icon/${summonerLevel}.png`)}
        className="Summoner-Icon"
        alt={summonerLevel}
      />
    </React.Fragment>
  );
};

export {
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
};
