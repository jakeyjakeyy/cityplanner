import React, { useState, useEffect } from "react";
import "./ThemeSelector.css";
import { FiSun } from "react-icons/fi";
import { LuMoonStar } from "react-icons/lu";

const ThemeSelector = () => {
  // Init
  const [colorTheme, setColorTheme] = useState("light");
  const root = document.getElementById("root") as HTMLElement;

  const toggleTheme = () => {
    console.log(root);
    if (colorTheme === "light") {
      console.log("light");
      root.classList.remove("light");
      root.classList.add("dark");
      setColorTheme("dark");
    } else {
      console.log("dark");
      root.classList.remove("dark");
      root.classList.add("light");
      setColorTheme("light");
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
