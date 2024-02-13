import React, { useState, useRef } from "react";
import "./Nav.css";
import GetTokens from "../../utils/gettokens";
import { FaUser } from "react-icons/fa";
import NavDropdown from "./NavDropdown";
import LoginForm from "./LoginForm";

const Nav = ({
  showHistory,
  setShowHistory,
}: {
  showHistory: boolean;
  setShowHistory: any;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [register, setRegister] = useState(false);
  const userIconRef = useRef<HTMLDivElement>(null);

  const toggleNav = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="loginContainer">
      <div className="userIcon" onClick={toggleNav} ref={userIconRef}>
        <FaUser size={20} />
      </div>
      {showDropdown ? (
        <NavDropdown
          showLoginForm={showLoginForm}
          setShowLoginForm={setShowLoginForm}
          setShowDropdown={setShowDropdown}
          setRegister={setRegister}
          userIconRef={userIconRef}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
      ) : null}
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

export default Nav;
