import React from "react";

import "./SearchResultCard.css";

import floatToTime from "../utils/floatToTime";

const SearchResultCard = ({
  item,
  type,
  index,
}: {
  item: any;
  type: string;
  index: number;
}) => {
  if (type === "place") {
    return (
      <div className="searchResultCard" id={index.toString()}>
        <div className="cardName">{item.displayName.text}</div>
        <div className="cardRating">{item.rating}</div>
        <div className="cardDistance">{item.distance}</div>
        {/* <div className="cardAddress">{item.formattedAddress}</div> */}
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
    <div className="searchResultCard">
      <div className="eventName">
        {type === "seatgeek" ? item.short_title : item.name}
      </div>
      <div className="eventVenueName">
        {type === "seatgeek" ? item.venue.name_v2 : ""}
      </div>
      <div className="eventTime">
        Starts in: <span id="spanTime">{floatToTime(item.hourDiff)}</span>
      </div>
      <a href={item.url} className="eventWebsite">
        View Event on {type === "seatgeek" ? "SeatGeek" : "Ticketmaster"}
      </a>
      {type === "Ticketmaster" ? (
        <a href={item.outlets[0].url} className="eventWebsite">
          Venue Website
        </a>
      ) : (
        <div></div>
      )}
      {type === "seatgeek" ? (
        <div className="eventPrices">
          Low as ${item.stats.lowest_price}
          <br />
          Average price: ${item.stats.average_price}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SearchResultCard;
