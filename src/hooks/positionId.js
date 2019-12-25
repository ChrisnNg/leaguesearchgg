import React from "react";

export default function(lane, role, currentRank) {
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

  if ((lane === "BOTTOM" && role === "DUO_SUPPORT") || "SOLO") {
    return img(tier, "Support");
  }

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
}
