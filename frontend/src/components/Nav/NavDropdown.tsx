import React from "react";
import "./NavDropdown.css";
import RefreshToken from "../../utils/refreshtoken";
import { useState, useEffect } from "react";

const NavDropdown = ({ showLoginForm, setShowLoginForm }: any) => {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
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
        <div className="navDropdownItem" onClick={handleShowLoginForm}>
          Login
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
