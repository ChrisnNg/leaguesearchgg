import React from "react";
import summoners from "../assets/summoners.json";

export default function(summonerId) {
  for (const element of summoners) {
    if (element.key === summonerId.toString()) {
      return (
        <img
          src={require(`../assets/summoners/${element.name
            .charAt(0)
            .toUpperCase() + element.name.substr(1)}.png`)}
          className="itemIcon"
          alt="summonerSpell"
        />
      );
    }
  }
  return "unidentified";
}
