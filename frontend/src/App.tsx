import React, { useState } from "react";
import "./App.css";
import NewMap from "./components/MapNew";
import Nav from "./components/Nav/Nav";
import Conversation from "./components/Conversation";
import ItineraryHistory from "./components/ItineraryHistory/ItineraryHistory";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState({});
  const [itinerary, setItinerary] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="App">
      <Nav showHistory={showHistory} setShowHistory={setShowHistory} />
      {!showHistory ? (
        <div>
          <Conversation
            setTempMapItem={setTempMapItem}
            selections={selections}
            setSelections={setSelections}
            itinerary={itinerary}
            setItinerary={setItinerary}
            tempMapItem={tempMapItem}
            currentResultIndex={currentResultIndex}
            setCurrentResultIndex={setCurrentResultIndex}
          />
          <NewMap
            tempMapItem={tempMapItem}
            selections={selections}
            itinerary={itinerary}
            currentResultIndex={currentResultIndex}
          />
        </div>
      ) : (
        <ItineraryHistory />
      )}
    </div>
  );
}

export default App;
