import React, { useState, useEffect } from "react";
import "./Nav.css";
import GetTokens from "../../utils/gettokens";
import { FaUser } from "react-icons/fa";
import NavDropdown from "./NavDropdown";
import LoginForm from "./LoginForm";

const Login = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleNav = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {}, [showLoginForm]);

  return (
    <div className="loginContainer">
      {showDropdown ? (
        <NavDropdown
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
        />
      ) : null}
      <div className="userIcon" onClick={toggleNav}>
        <FaUser size={20} />
      </div>
      {/* <form onSubmit={handleSubmit}>
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
      </form> */}
      {showLoginForm ? <LoginForm setShowLoginForm={setShowLoginForm} /> : null}
    </div>
  );
};

export default Login;
