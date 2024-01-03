import React from "react";
import "./SearchResultsContainer.css";
import SearchResultCard from "./SearchResultCard";

const SearchResultCardContainer = ({
  searchResults,
  handleSelection,
  handleSelectionEvent,
  handleMouseEnter,
}: any) => {
  return (
    <div className="searchResults">
      {searchResults?.searchResults.places.map((place: any, index: number) => (
        <div
          className="searchResultCardContainer"
          key={place.displayName.text}
          onClick={handleSelection}
          id={searchResults?.searchResults?.places?.indexOf(place)?.toString()}
          onMouseEnter={() => handleMouseEnter(index)}

          // onMouseLeave={() => setTempMapItem({})}
        >
          <SearchResultCard item={place} type="place" index={index} />
        </div>
      ))}
      {searchResults?.events
        ? searchResults?.events?.ticketmaster.map(
            (event: any, index: number) => (
              <div
                className="eventResultCard"
                id={searchResults?.events?.ticketmaster
                  .indexOf(event)
                  ?.toString()}
                onClick={handleSelectionEvent}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                <SearchResultCard
                  item={event}
                  type="ticketmaster"
                  index={index}
                />
              </div>
            )
          )
        : ""}
      {searchResults?.events?.seatgeek.map((event: any, index: number) => (
        <div
          className="eventResultCard"
          id={searchResults?.events?.seatgeek.indexOf(event)?.toString()}
          onClick={handleSelectionEvent}
          onMouseEnter={() => handleMouseEnter(index)}
        >
          <SearchResultCard item={event} type="seatgeek" index={index} />
        </div>
      ))}
    </div>
  );
};

export default SearchResultCardContainer;
