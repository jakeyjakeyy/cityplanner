import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Login from "./components/Login";
import Conversation from "./components/Conversation";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    console.log(selections);
  }, [selections]);

  return (
    <div className="App">
      <Login />
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
