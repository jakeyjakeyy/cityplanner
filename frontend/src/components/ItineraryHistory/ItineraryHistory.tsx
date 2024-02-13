import React, { useState, useEffect } from "react";
import "./ItineraryHistory.css";

const ItineraryHistory = () => {
  const [itineraryHistory, setItineraryHistory] = useState([]);

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

  return (
    <div className="itineraryHistory">
      <h2>Itinerary History</h2>
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
            <div key={index} className="itineraryHistoryItem">
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
