import React from "react";

const ConfirmItinerary = (
  { itinerary }: any,
  setUserActivelyChangingItinerary: boolean
) => {
  console.log(itinerary);
  return (
    <div>
      {itinerary.map((activity: any, index: number) => {
        return <div>{activity}</div>;
      })}
    </div>
  );
};

export default ConfirmItinerary;
