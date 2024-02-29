import React, { useEffect, useRef } from "react";
import "./NavDropdown.css";
import { FaHistory } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";
import RefreshToken from "../../utils/refreshtoken";

const NavDropdown = ({
  showLoginForm,
  setShowLoginForm,
  setShowDropdown,
  setRegister,
  userIconRef,
  showHistory,
  setShowHistory,
}: any) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkToken = () => {
    if (!localStorage.getItem("token")) {
      return;
    }
    RefreshToken().then((response) => {
      if (response && response.message === "Expired token") {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
      }
    });
  };

  const handleShowLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleShowRegisterForm = () => {
    setShowLoginForm(!showLoginForm);
    setRegister(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    setShowHistory(false);
    setShowDropdown(false);
  };

  const handleHistory = () => {
    setShowHistory(!showHistory);
    setShowDropdown(false);
  };

  useEffect(() => {
    // check token on load to see user's authentication status
    checkToken();

    // init handle closing of dropdown when clicking outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        userIconRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !userIconRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navDropdownContainer" ref={dropdownRef}>
      {localStorage.getItem("token") ? (
        <div className="navDropdownItemContainer">
          <div
            className="navDropdownItem"
            onClick={handleHistory}
            tabIndex={0}
            onKeyDown={(e) => {
              e.key === "Enter" && handleHistory();
            }}
          >
            <div className="navDropdownIcon">
              {showHistory ? (
                <FaHome size={14} aria-label="Home Icon" />
              ) : (
                <FaHistory size={14} aria-label="History Icon" />
              )}
            </div>
            {showHistory ? "Home" : "History"}
          </div>
          <div
            className="navDropdownItem"
            onClick={handleLogout}
            tabIndex={0}
            onKeyDown={(e) => {
              e.key === "Enter" && handleLogout();
            }}
          >
            <div className="navDropdownIcon">
              <FaSignOutAlt size={14} aria-label="Logout" />
            </div>
            Logout
          </div>
        </div>
      ) : (
        <div className="navDropdownItemContainer">
          <div
            className="navDropdownItem"
            onClick={handleShowLoginForm}
            tabIndex={0}
            onKeyDown={(e) => {
              e.key === "Enter" && handleShowLoginForm();
            }}
          >
            <div className="navDropdownIcon">
              <FaSignInAlt size={14} aria-label="Sign In" />
            </div>
            Login
          </div>
          <div
            className="navDropdownItem"
            onClick={handleShowRegisterForm}
            tabIndex={0}
            onKeyDown={(e) => {
              e.key === "Enter" && handleShowRegisterForm();
            }}
          >
            <div className="navDropdownIcon">
              <FaWpforms size={14} aria-label="Register" />
            </div>
            Register
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
