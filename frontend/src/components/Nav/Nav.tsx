import React, { useState, useRef } from "react";
import "./Nav.css";
import { FaUser } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import NavDropdown from "./NavDropdown";
import LoginForm from "./LoginForm";
import ThemeSelector from "./ThemeSelector";

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

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="navContainer">
      <div className="leftNav">
        <div className="homeIcon" onClick={goHome}>
          <MdHome size={20} />
        </div>
      </div>
      <div className="rightNav">
        <ThemeSelector />
        <div className="dropdownParent">
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
      </div>
    </div>
  );
};

export default Nav;
