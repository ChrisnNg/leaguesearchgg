import React from "react";
import timeago from "epoch-timeago";

const TimeAgo = ({ time }) => {
  return <time dateTime={new Date(time).toISOString()}>{timeago(time)}</time>;
};

export default TimeAgo;
