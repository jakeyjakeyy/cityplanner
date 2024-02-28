import React from "react";
import "./LoginForm.css";
import { useState, useEffect, useRef } from "react";
import GetTokens from "../../utils/gettokens";
import Register from "../../utils/register";
import { IoIosCloseCircleOutline } from "react-icons/io";

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

  useEffect(() => {
    console.log(password2);
  }, [password2]);

  const handleSubmit = async () => {
    if (!username || !password) {
      alert("Please enter a username and password");
      return;
    }
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

    const tokens = await GetTokens(username, password);
    if (tokens === "Invalid username or password.") {
      alert("Invalid username or password.");
      setUsername("");
      setPassword("");
      const inputElement = loginRef.current?.querySelector(
        "#formUsername input"
      ) as HTMLInputElement;
      inputElement?.focus();
      return;
    }
    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("username", username);
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Form doesn't submit on enter keypress without this in a useEffect specifically
    // for username and password. Otherwise the strings were resetting (not sure why)
    const keydownHandler = (event: any) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, [username, password]);

  return (
    <div className="loginFormOverlay">
      <div className="loginFormContainer" ref={loginRef}>
        <div className="loginForm">
          <div className="closeButton" onClick={onClose}>
            <IoIosCloseCircleOutline size={20} />
          </div>
          <div className="inputContainer">
            <form
              id="lcForm"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <div id="formUsername">
                Username:
                <input
                  type="text"
                  value={username}
                  id="inputField"
                  autoFocus
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div id="formPassword">
                Password:
                <input
                  type="password"
                  id="inputField"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {register ? (
                <div id="formConfirmPassword">
                  Confirm Password:
                  <input
                    type="password"
                    id="inputField"
                    value={password2}
                    onChange={(event) => setPassword2(event.target.value)}
                  />
                </div>
              ) : null}
              <div className="submitContainer">
                <input type="submit" style={{ display: "none" }} />
                <div id="submitButton" onClick={handleSubmit}>
                  Submit
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
