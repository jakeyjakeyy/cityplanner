import React, { useState, useEffect } from "react";
import "./ItineraryHistory.css";

const ItineraryHistory = ({
  setSelections,
  setCurrentResultIndex,
  setShowHistory,
  setItinerary,
  setMessage,
}: any) => {
  const [itineraryHistory, setItineraryHistory] = useState<any[]>([]);

  // Fetch itinerary history from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "history" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.itineraries);
        setItineraryHistory(data.itineraries);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const itinerary = itineraryHistory[Number(e.currentTarget.id)];
    setSelections(itinerary.selections);
    setItinerary(itinerary.itinerary);
    setMessage(itinerary.message);
    setShowHistory(false);
    setCurrentResultIndex(itinerary.itinerary.length);
  };

  return (
    <div className="itineraryHistory">
      <div className="itineraryHistoryHeader">
        <h2>Itinerary History</h2>
        <h4>User: {localStorage.getItem("username")}</h4>
      </div>
      <div className="itineraryHistoryContainer">
        {itineraryHistory.map((itinerary: any, index: number) => {
          const date = new Date(itinerary.date);
          const localDate = date.toLocaleString();
          let strItinerary = "";
          itinerary.itinerary.forEach((item: any) => {
            if (item === itinerary.itinerary[itinerary.itinerary.length - 1]) {
              strItinerary += item;
              return;
            }
            strItinerary += item + " -> ";
          });
          return (
            <div
              key={index}
              id={index.toString()}
              className="itineraryHistoryItem"
              onClick={handleSelect}
            >
              <div className="historyLocation">{itinerary.location}</div>
              <div className="historyItinerary">{strItinerary}</div>
              <div className="historyDate">{localDate}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryHistory;
