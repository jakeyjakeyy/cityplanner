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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>cool!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Conversation />
        <Map />
      </header>
    </div>
  );
}

export default App;
