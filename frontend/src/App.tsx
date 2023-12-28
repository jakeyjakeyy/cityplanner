import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Login from "./components/Nav/Nav";
import Conversation from "./components/Conversation";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  return (
    <div className="App">
      <Login />
      <Conversation
        setTempMapItem={setTempMapItem}
        selections={selections}
        setSelections={setSelections}
        itinerary={itinerary}
        setItinerary={setItinerary}
      />
      <Map
        tempMapItem={tempMapItem}
        selections={selections}
        itinerary={itinerary}
      />
    </div>
  );
}

export default App;
