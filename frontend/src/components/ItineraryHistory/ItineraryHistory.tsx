import React, { useState, useEffect } from "react";
import DeleteOverlay from "./DeleteOverlay";
import "./ItineraryHistory.css";
import { FaTrash } from "react-icons/fa";

const RESULTS_PER_PAGE = 5;

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
        setTotalPages(Math.ceil(data.itineraries.length / RESULTS_PER_PAGE));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelect = (e: any) => {
    let itinerary = null;
    if (typeof e === "number") {
      itinerary = itineraryHistory[e];
    } else {
      itinerary = itineraryHistory[Number(e.currentTarget.id)];
    }
    setSelections(itinerary.selections);
    setItinerary(itinerary.itinerary);
    setMessage(itinerary.message);
    setShowHistory(false);
    setCurrentResultIndex(itinerary.itinerary.length);
  };

  const historyDelete = (e: any) => {
    e.stopPropagation();
    let index = null;
    if (typeof e === "number") {
      index = e;
    } else {
      index = Number(e.currentTarget.parentElement?.id);
    }
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
    if (window.location.pathname == "/") {
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
        <div className="pagination">
          <button
            className={
              page > 1 ? "paginationButton" : "paginationButtonDisabled"
            }
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          >
            Previous
          </button>
          <div className="pageInfo">
            Page {page} of {totalPages}
          </div>
          <button
            className={
              page < totalPages
                ? "paginationButton"
                : "paginationButtonDisabled"
            }
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
              }
            }}
          >
            Next
          </button>
        </div>
        {itineraryHistory.map((itinerary: any, index: number) => {
          // Convert date to local time
          if (
            index > RESULTS_PER_PAGE * page - 1 ||
            index < RESULTS_PER_PAGE * page - RESULTS_PER_PAGE
          )
            return;
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
              tabIndex={0}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSelect(index);
              }}
            >
              <div
                className="historyDelete"
                onClick={historyDelete}
                aria-label="Delete History Item"
                tabIndex={0}
                onKeyDown={(e) => {
                  e.key === "Enter" && historyDelete(index);
                }}
              >
                <FaTrash color="red" aria-label="Delete History Item" />
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
