import React from "react";
import "./DeleteOverlay.css";

const DeleteOverlay = ({ setShowDeleteOverlay, targetID, setDeleted }: any) => {
  const id = targetID;
  const handleDelete = () => {
    fetch("http://localhost:8000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ action: "delete", id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setShowDeleteOverlay(false);
        setDeleted((prev: any) => [...prev, id]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="deleteOverlay">
      <div className="deleteOverlayContent">
        <div className="confirmDeleteText">
          Are you sure you want to delete this itinerary?
        </div>
        <div className="deleteOverlayButtons">
          <div className="deleteOverlayButton" onClick={handleDelete}>
            Yes
          </div>
          <div
            className="deleteOverlayButton"
            onClick={() => setShowDeleteOverlay(false)}
          >
            No
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOverlay;
