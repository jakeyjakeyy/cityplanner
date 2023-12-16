import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Login from "./components/Login";
import Conversation from "./components/Conversation";

function App() {
  const [tempMapItem, setTempMapItem] = useState({});

  useEffect(() => {
    console.log(tempMapItem);
  }, [tempMapItem]);

  return (
    <div className="App">
      <Login />
      <header className="App-header">
        <Conversation setTempMapItem={setTempMapItem} />
        <Map tempMapItem={tempMapItem} />
      </header>
    </div>
  );
}

export default App;
