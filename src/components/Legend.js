import React, { useEffect, useState } from "react";

const getDaysAgo = (time) => {
  return Math.floor((Date.now() / 1000 - time) / (24 * 60 * 60));
};

const findLastVisited = (locations) => {
  let maxTimeStamp = 0;
  let lastVisited = null;

  for (let location of locations) {
    if (location.timestamp.seconds > maxTimeStamp) {
      maxTimeStamp = location.timestamp.seconds;
      lastVisited = location;
    }
  }

  return {
    lastVisited: lastVisited ? lastVisited.location : null,
    daysAgo: lastVisited ? getDaysAgo(lastVisited.timestamp.seconds) : null,
  };
};

const Legend = (props) => {
  const [lastLocation, setLastLocation] = useState(null);
  const [daysAgo, setDaysAgo] = useState(null);

  useEffect(() => {
    const { lastVisited, daysAgo } = findLastVisited(props.locations);
    setLastLocation(lastVisited);
    setDaysAgo(daysAgo);
  }, [props.locations]);

  return (
    <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
      <div className="mb6">
        <h2 className="txt-bold txt-s block">Last location visited</h2>
        <p className="txt-s color-gray">{lastLocation}</p>
        <p className="txt-s color-gray">{daysAgo} days ago</p>
      </div>
    </div>
  );
};

export default Legend;
