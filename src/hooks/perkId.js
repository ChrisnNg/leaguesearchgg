import React from "react";
import perks from "../assets/dragontail-9.24.2/9.24.2/data/en_US/runesReforged.json";

export default function(perkId) {
  for (const element of perks) {
    if (element["id"] === perkId.primary) {
      if (perkId.slot1) {
        for (const perk of element.slots) {
          for (const element of perk.runes) {
            if (element.id === perkId.slot1) {
              return (
                <img
                  src={require(`../assets/dragontail-9.24.2/img/${element.icon}`)}
                  className="itemIcon"
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
          className="itemIcon"
          alt="summonerSpell"
        />
      );
    }
  }

  return perkId;
}
