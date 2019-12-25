import queue from "../assets/queues.json";

export default function(queueId) {
  for (const element of queue) {
    if (element.queueId == queueId) {
      return element.description;
    }
  }
  return "unidentified";
}
