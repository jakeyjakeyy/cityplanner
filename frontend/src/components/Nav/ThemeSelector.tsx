import React, { useState, useEffect } from "react";
import "./ThemeSelector.css";
import { FiSun } from "react-icons/fi";
import { LuMoonStar } from "react-icons/lu";

const ThemeSelector = () => {
  // Init
  const root = document.getElementById("root") as HTMLElement;
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "light");
  }
  const [colorTheme, setColorTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  root.classList.add(colorTheme);

  const toggleTheme = () => {
    if (colorTheme === "light") {
      root.classList.remove("light");
      root.classList.add("dark");
      setColorTheme("dark");
      localStorage.setItem("theme", "dark");
      window.dispatchEvent(new Event("storage"));
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      setColorTheme("light");
      localStorage.setItem("theme", "light");
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="ThemeSelector" onClick={toggleTheme}>
      {colorTheme === "dark" ? (
        <FiSun id={"lightSelectorIcon"} size={20} />
      ) : (
        <LuMoonStar id={"darkSelectorIcon"} size={20} />
      )}
    </div>
  );
};

export default ThemeSelector;
