import champions from "../assets/dragontail-9.24.2/9.24.2/data/en_US/champion.json";

export default function(champID) {
  console.log(champions.data);

  for (const key in champions.data) {
    if (champions.data[key]["key"] == champID) {
      return champions.data[key]["id"];
    }
  }
}

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
