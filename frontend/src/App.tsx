import React, { useState, useEffect } from "react";
import "./App.css";
import NewMap from "./components/MapNew";
import Nav from "./components/Nav/Nav";
import Conversation from "./components/Conversation";
import ItineraryHistory from "./components/ItineraryHistory/ItineraryHistory";
import GetTokens from "./utils/gettokens";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState({});
  const [itinerary, setItinerary] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // guest user
    if (window.location.pathname === "/guest") {
      GetTokens("guest", "password").then((tokens) => {
        console.log(tokens);
        localStorage.setItem("token", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        localStorage.setItem("username", "guest");
      });
    }

    // Handle state
    window.history.pushState({ showHistory }, "", "/");
    const handlePopState = (event: PopStateEvent) => {
      if (window.location.pathname === "/history") {
        setShowHistory(true);
        setCurrentResultIndex(-1);
        setSelections({});
        setItinerary([]);
        setMessage("");
      } else {
        setShowHistory(false);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="App">
      <Nav showHistory={showHistory} setShowHistory={setShowHistory} />
      {!showHistory ? (
        <div className="ConversationParent">
          <Conversation
            setTempMapItem={setTempMapItem}
            selections={selections}
            setSelections={setSelections}
            itinerary={itinerary}
            setItinerary={setItinerary}
            tempMapItem={tempMapItem}
            currentResultIndex={currentResultIndex}
            setCurrentResultIndex={setCurrentResultIndex}
            message={message}
            setMessage={setMessage}
          />
          <NewMap
            tempMapItem={tempMapItem}
            selections={selections}
            itinerary={itinerary}
            currentResultIndex={currentResultIndex}
          />
        </div>
      ) : (
        <ItineraryHistory
          setSelections={setSelections}
          setCurrentResultIndex={setCurrentResultIndex}
          setShowHistory={setShowHistory}
          setItinerary={setItinerary}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}

export default App;
