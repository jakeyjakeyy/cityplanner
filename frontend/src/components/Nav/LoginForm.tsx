import React from "react";
import "./LoginForm.css";
import { useState } from "react";
import GetTokens from "../../utils/gettokens";
import Register from "../../utils/register";

const LoginForm = ({
  setShowLoginForm,
  toggleNav,
  register,
  setRegister,
}: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const onClose = () => {
    setShowLoginForm(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (register && password !== password2) {
      alert("Passwords do not match");
      return;
    } else if (register && password === password2) {
      const response = await Register(username, password);
      console.log(response);
      if (response && response.message === "User creation failed") {
        alert("User creation failed");
        setUsername("");
        setPassword("");
        setPassword2("");
        return;
      }
    }

    const tokens = await GetTokens(username, password);
    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    onClose();
    setRegister(false);
    toggleNav();
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
          {register ? (
            <label>
              Confirm Password:
              <input
                type="password"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
              />
            </label>
          ) : null}
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
