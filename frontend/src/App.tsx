import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map";
import Login from "./components/Login";
import Conversation from "./components/Conversation";

function App() {
  return (
    <div className="App">
      <Login />
      <header className="App-header">
        <Conversation />
        <Map />
      </header>
    </div>
  );
}

export default App;
