import React, { useState } from "react";
import "./App.css";
import NewMap from "./components/MapNew";
import Login from "./components/Nav/Nav";
import Conversation from "./components/Conversation";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState({});
  const [itinerary, setItinerary] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  return (
    <div className="App">
      <Login />
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
  );
}

export default App;
