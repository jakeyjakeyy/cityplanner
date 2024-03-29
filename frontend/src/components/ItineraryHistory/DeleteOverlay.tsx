import React, { useEffect } from "react";
import "./DeleteOverlay.css";

const DeleteOverlay = ({ setShowDeleteOverlay, targetID, setDeleted }: any) => {
  const id = targetID;
  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/profile`, {
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

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target == document.querySelector(".deleteOverlay")) {
        setShowDeleteOverlay(false);
      }
    });
  }, []);

  return (
    <div className="deleteOverlay">
      <div className="deleteOverlayContent">
        <div className="confirmDeleteText">
          Are you sure you want to delete this itinerary?
        </div>
        <div className="deleteOverlayButtons">
          <div
            className="deleteOverlayButton confirmDeleteButton"
            onClick={handleDelete}
          >
            Yes
          </div>
          <div
            className="deleteOverlayButton rejectDeleteButton"
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
