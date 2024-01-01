import React from "react";

import "./SearchResultCard.css";

const SearchResultCard = ({ item, type }: { item: any; type: string }) => {
  if (type === "place") {
    return (
      <div className="searchResultCard" style={{ pointerEvents: "none" }}>
        <div className="cardName">{item.displayName.text}</div>
        <div className="cardRating">{item.rating}</div>
        <div className="cardDistance">{item.distance}</div>
        <div className="cardAddress">{item.formattedAddress}</div>
        <a href={item.websiteUri} className="cardWebsite">
          Visit Website
        </a>
        <div className="cardDescription">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </div>
    );
  }
  return (
    <div className="searchResultCard" style={{ pointerEvents: "none" }}>
      <div className="eventName">{item.short_title}</div>
      <div className="eventVenueName">{item.venue.name_v2}</div>
      <div className="eventVenueAddress">
        {item.venue.address}, {item.venue.extended_address}
      </div>
      <div className="eventPrices">
        Low as ${item.stats.lowest_price}
        <br />
        Average price: ${item.stats.average_price}
      </div>
    </div>
  );
};

export default SearchResultCard;
