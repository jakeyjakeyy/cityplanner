import React, { useState, useEffect } from "react";

const queriesList = [
  '"Fun night in Portland with friends"',
  '"Dinner and live music in New York"',
  '"Family day in San Francisco"',
];

const QueryScroller = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % queriesList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div>
      <p>{queriesList[index]}</p>
    </div>
  );
};

export default QueryScroller;
