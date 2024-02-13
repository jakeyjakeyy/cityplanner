import React, { useEffect, useRef } from "react";
import "./NavDropdown.css";
import RefreshToken from "../../utils/refreshtoken";

const NavDropdown = ({
  showLoginForm,
  setShowLoginForm,
  setShowDropdown,
  setRegister,
  userIconRef,
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
    setShowDropdown(false);
  };

  const handleHistory = () => {
    // redirect to history page
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
          <div className="navDropdownItem" onClick={handleHistory}>
            History
          </div>
          <div className="navDropdownItem" onClick={handleLogout}>
            Logout
          </div>
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
