import React from "react";

export default function(matchData) {
  let participants = [];

  // console.log(matchData.participants);
  let count = 0;
  for (const player of matchData.participantIdentities) {
    count += 1;
    console.log("array", player.participantId, player.player.summonerName);
    participants.push(<p>{player.player.summonerName}</p>);
    if (count === 5) {
      console.log("other team");
      participants.push(<br />);
    }
  }
  return <article>{participants}</article>;
}
