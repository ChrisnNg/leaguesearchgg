import React from "react";

export default function(playerStats) {
  return (
    <div>
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item0}.png`)}
        className="champIcon"
        alt="Item0"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item1}.png`)}
        className="champIcon"
        alt="Item1"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item2}.png`)}
        className="champIcon"
        alt="Item2"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item3}.png`)}
        className="champIcon"
        alt="Item3"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item4}.png`)}
        className="champIcon"
        alt="Item4"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item5}.png`)}
        className="champIcon"
        alt="Item5"
      />
      <img
        src={require(`../assets/dragontail-9.24.2/9.24.2/img/item/${playerStats.item6}.png`)}
        className="champIcon"
        alt="Item6"
      />
    </div>
  );
}
