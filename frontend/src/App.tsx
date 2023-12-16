import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Login from "./components/Login";
import Conversation from "./components/Conversation";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});
  const [selections, setSelections] = useState([]);

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
        />
        <Map tempMapItem={tempMapItem} selections={selections} />
      </header>
    </div>
  );
}

export default App;
