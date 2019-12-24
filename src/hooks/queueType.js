export default function(queue) {
  switch (queue) {
    case "RANKED_SOLO_5x5":
      return "Solo Queue";
    case "RANKED_FLEX_SR":
      return "Flex Queue";
  }

  return "unidentified";
}
