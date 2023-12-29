import React, { useState, useEffect } from "react";
import "./Nav.css";
import GetTokens from "../../utils/gettokens";
import { FaUser } from "react-icons/fa";
import NavDropdown from "./NavDropdown";
import LoginForm from "./LoginForm";

const Login = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [register, setRegister] = useState(false);

  const toggleNav = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="loginContainer">
      {showDropdown ? (
        <NavDropdown
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
          toggleNav={toggleNav}
          setRegister={setRegister}
        />
      ) : null}
      <div className="userIcon" onClick={toggleNav}>
        <FaUser size={20} />
      </div>
      {showLoginForm ? (
        <LoginForm
          setShowLoginForm={setShowLoginForm}
          toggleNav={toggleNav}
          register={register}
          setRegister={setRegister}
        />
      ) : null}
    </div>
  );
};

export default Login;
