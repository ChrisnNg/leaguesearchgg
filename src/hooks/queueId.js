import queue from "../assets/queues.json";

export default function(queueId) {
  for (const element of queue) {
    if (element.queueId === queueId) {
      return element.description.slice(0, -5);
    }
  }
  return "unidentified";
}
