import React from "react";
import "./LoginForm.css";
import { useState } from "react";
import GetTokens from "../../utils/gettokens";

const LoginForm = ({ setShowLoginForm }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onClose = () => {
    setShowLoginForm(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    GetTokens(username, password).then((tokens) => {
      localStorage.setItem("token", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
    });
  };

  return (
    <div className="loginFormOverlay">
      <div className="loginForm">
        <div className="closeButton" onClick={onClose}>
          X
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
