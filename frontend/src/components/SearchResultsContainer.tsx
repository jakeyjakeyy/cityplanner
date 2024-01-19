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
      {searchResults?.events
        ? searchResults?.events?.map((event: any, index: number) => (
            <div
              className="searchResultCardContainer"
              id={searchResults?.events?.indexOf(event)?.toString()}
              onClick={handleSelectionEvent}
              onMouseEnter={() => handleMouseEnter(index, "event")}
            >
              <SearchResultCard
                item={event}
                type={event.apiType}
                index={index}
              />
            </div>
          ))
        : ""}
      {searchResults?.searchResults.places.map((place: any, index: number) => (
        <div
          className="searchResultCardContainer"
          key={place.displayName.text}
          onClick={handleSelection}
          id={searchResults?.searchResults?.places?.indexOf(place)?.toString()}
          onMouseEnter={() => handleMouseEnter(index, "place")}
        >
          <SearchResultCard item={place} type="place" index={index} />
        </div>
      ))}
    </div>
  );
};

export default SearchResultCardContainer;
