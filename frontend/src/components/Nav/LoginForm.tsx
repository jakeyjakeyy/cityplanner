import React from "react";
import "./LoginForm.css";
import { useState, useEffect, useRef } from "react";
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
  const loginRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setShowLoginForm(false);
    setRegister(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (register && password !== password2) {
      alert("Passwords do not match");
      return;
    } else if (register && password === password2) {
      const response = await Register(username, password);
      if (response && response.message === "User creation failed") {
        alert("User creation failed");
        setUsername("");
        setPassword("");
        setPassword2("");
        return;
      }
    }

    console.log("username: " + username);

    const tokens = await GetTokens(username, password);
    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    onClose();
    setRegister(false);
    toggleNav();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // document.addEventListener("keydown", (event) => {
    //   if (event.key === "Escape") {
    //     onClose();
    //   } else if (event.key === "Enter") {
    //     handleSubmit(event);
    //   }
    // });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="loginFormOverlay">
      <div className="loginFormContainer" ref={loginRef}>
        <div className="loginForm">
          <div className="closeButton" onClick={onClose}>
            X
          </div>
          <div className="inputContainer">
            <form id="lcForm">
              <div id="formUsername">
                Username:
                <input
                  type="text"
                  value={username}
                  autoFocus
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div id="formPassword">
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {register ? (
                <div id="formConfirmPassword">
                  Confirm Password:
                  <input
                    type="password"
                    value={password2}
                    onChange={(event) => setPassword2(event.target.value)}
                  />
                </div>
              ) : null}
              <input type="submit" value="Submit" onClick={handleSubmit} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
