import React from "react";

import "./PriceLevelSelector.css";

const PriceLevelSelector = ({ setPriceLevels }: any) => {
  const priceLevels = [
    "",
    "PRICE_LEVEL_INEXPENSIVE",
    "PRICE_LEVEL_MODERATE",
    "PRICE_LEVEL_EXPENSIVE",
    "PRICE_LEVEL_VERY_EXPENSIVE",
  ];

  const handlePriceLevel = (event: any) => {
    const selectedValue = event.target.value;
    const selectedIndex = priceLevels.indexOf(selectedValue);
    setPriceLevels(priceLevels.slice(1, selectedIndex + 1));
  };

  return (
    <div className="price-level-selector">
      <label htmlFor="price-level">Price Level</label>
      <select name="price-level" id="price-level" onChange={handlePriceLevel}>
        {priceLevels.map((level, index) => (
          <option key={index} value={level}>
            {"$".repeat(index)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PriceLevelSelector;
