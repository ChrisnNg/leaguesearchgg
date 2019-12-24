import champions from "../assets/dragontail-9.24.2/9.24.2/data/en_US/champion.json";

export default function(champID) {
  console.log(champID);
  console.log(champions.data);

  for (const key in champions.data) {
    // console.log(key);
    if (champions[key][key] == champID) {
      return champions[key]["id"];
    }
  }
}
