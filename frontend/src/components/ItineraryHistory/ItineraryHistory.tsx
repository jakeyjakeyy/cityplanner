import React, { useState, useEffect } from "react";
import DeleteOverlay from "./DeleteOverlay";
import "./ItineraryHistory.css";
import { FaTrash } from "react-icons/fa";

const ItineraryHistory = ({
  setSelections,
  setCurrentResultIndex,
  setShowHistory,
  setItinerary,
  setMessage,
}: any) => {
  const [itineraryHistory, setItineraryHistory] = useState<any[]>([]);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [targetID, setTargetID] = useState(0);
  const [deleted, setDeleted] = useState([] as number[]);

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

  const historyDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const index = Number(e.currentTarget.parentElement?.id);
    const item = itineraryHistory[index];
    setTargetID(Number(item.id));
    setShowDeleteOverlay(true);
  };

  useEffect(() => {
    if (deleted.length > 0) {
      const newItineraryHistory = itineraryHistory.filter(
        (item: any) => !deleted.includes(item.id)
      );
      setItineraryHistory(newItineraryHistory);
    }
  }, [deleted]);

  useEffect(() => {
    if (window.location.pathname !== "/history") {
      window.history.pushState(null, "", "/history");
    }
  }, []);

  return (
    <div className="itineraryHistory">
      {showDeleteOverlay && (
        <DeleteOverlay
          setShowDeleteOverlay={setShowDeleteOverlay}
          targetID={targetID}
          setDeleted={setDeleted}
        />
      )}
      <div className="itineraryHistoryHeader">
        <h2>Itinerary History</h2>
        <h4>User: {localStorage.getItem("username")}</h4>
      </div>
      <div className="itineraryHistoryContainer">
        {itineraryHistory.map((itinerary: any, index: number) => {
          // Convert date to local time
          const date = new Date(itinerary.date);
          const localDate = date.toLocaleString();
          let strItinerary = "";
          itinerary.itinerary.forEach((item: any) => {
            if (item === itinerary.itinerary[itinerary.itinerary.length - 1]) {
              strItinerary += item;
              return;
            }
            strItinerary += item + ", ";
          });
          return (
            <div
              key={index}
              id={index.toString()}
              className="itineraryHistoryItem"
              onClick={handleSelect}
            >
              <div className="historyDelete" onClick={historyDelete}>
                <FaTrash color="red" />
              </div>
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
