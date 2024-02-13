import React from "react";
import "./SearchResultCard.css";
import floatToTime from "../../utils/floatToTime";
import { FaStar } from "react-icons/fa";
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
        <div className="cardRating">
          {item.rating} <FaStar color="gold" size={16} />
        </div>
        <div className="cardDistance">{item.distance}</div>
        {/* <div className="cardAddress">{item.formattedAddress}</div> */}
        <a href={item.websiteUri} className="cardWebsite">
          Visit Website
        </a>
        <div className="cardDescription">
          {item.editorialSummary ? item.editorialSummary.text : ""}
        </div>
        <div className="cardPicture">
          {/* <img src={item.photo} alt="" /> */}
        </div>
      </div>
    );
  } else if (type === "loading") {
    return (
      <div className="searchResultCard">
        <div className="cardName">Loading...</div>
      </div>
    );
  }
  return (
    <div className="searchResultCard">
      <div className="cardName">
        {type === "seatgeek" ? item.short_title : item.name}
      </div>
      <div className="eventVenueName">
        {type === "seatgeek" ? item.venue.name_v2 : ""}
      </div>
      <div className="eventTime">
        Starts in: <span id="spanTime">{floatToTime(item.hourDiff)}</span>
      </div>
      <a href={item.url} className="cardWebsite">
        View Event on {type === "seatgeek" ? "SeatGeek" : "Ticketmaster"}
      </a>
      {type === "Ticketmaster" ? (
        <a href={item.outlets[0].url} className="cardWebsite">
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
