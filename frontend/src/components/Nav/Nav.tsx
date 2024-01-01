import React, { useState, useRef } from "react";
import "./Nav.css";
import GetTokens from "../../utils/gettokens";
import { FaUser } from "react-icons/fa";
import NavDropdown from "./NavDropdown";
import LoginForm from "./LoginForm";

const Login = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [register, setRegister] = useState(false);
  const userIconRef = useRef<HTMLDivElement>(null);

  const toggleNav = () => {
    console.log("toggle nav");
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="loginContainer">
      {showDropdown ? (
        <NavDropdown
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
          setShowDropdown={setShowDropdown}
          setRegister={setRegister}
          userIconRef={userIconRef}
        />
      ) : null}
      <div className="userIcon" onClick={toggleNav} ref={userIconRef}>
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
