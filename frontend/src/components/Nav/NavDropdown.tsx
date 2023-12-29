import React from "react";
import "./NavDropdown.css";
import RefreshToken from "../../utils/refreshtoken";
import { useState, useEffect } from "react";

const NavDropdown = ({
  showLoginForm,
  setShowLoginForm,
  toggleNav,
  setRegister,
}: any) => {
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
    toggleNav();
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="navDropdownContainer">
      {localStorage.getItem("token") ? (
        <div className="navDropdownItem" onClick={handleLogout}>
          Logout
        </div>
      ) : (
        <div className="navDropdownItemContainer">
          <div className="navDropdownItem" onClick={handleShowLoginForm}>
            Login
          </div>
          <div className="navDropdownItem" onClick={handleShowRegisterForm}>
            Register
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
