import React from "react";
import summoners from "../assets/summoners.json";

export default function(summonerId) {
  for (const element of summoners) {
    console.log(element);
    if (element.key == summonerId) {
      return (
        <img
          src={require(`../assets/summoners/${element.name
            .charAt(0)
            .toUpperCase() + element.name.substr(1)}.png`)}
          className="champIcon"
          alt="Item0"
        />
      );
    }
  }
  return "unidentified";
}
