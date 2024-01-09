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
    <div className="searchResults snaps-inline">
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
        ? searchResults?.events?.map((event: any, index: number) => (
            <div
              className="eventResultCard"
              id={searchResults?.events?.indexOf(event)?.toString()}
              onClick={handleSelectionEvent}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <SearchResultCard
                item={event}
                type={event.apiType}
                index={index}
              />
            </div>
          ))
        : ""}
    </div>
  );
};

export default SearchResultCardContainer;
