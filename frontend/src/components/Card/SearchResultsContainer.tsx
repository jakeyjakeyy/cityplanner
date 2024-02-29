import React, { useEffect, useRef } from "react";
import "./SearchResultsContainer.css";
import SearchResultCard from "./SearchResultCard";

const SearchResultCardContainer = ({
  searchResults,
  handleSelection,
  handleSelectionEvent,
  handleMouseEnter,
  searchResultsLoading,
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [searchResults]);

  // if we are loading, display a loading card
  if (searchResultsLoading) {
    return (
      <div className="searchResults">
        <div className="searchResultCardContainer">
          <SearchResultCard item={null} type="loading" index={0} />
        </div>
      </div>
    );
  }
  // else we return search results
  return (
    <div className="searchResults" ref={containerRef}>
      {searchResults?.events
        ? searchResults?.events?.map((event: any, index: number) => (
            <div
              className="searchResultCardContainer"
              id={searchResults?.events?.indexOf(event)?.toString()}
              onClick={handleSelectionEvent}
              onMouseEnter={() => handleMouseEnter(index, "event")}
              key={event.name}
              tabIndex={0}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSelectionEvent();
              }}
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
          tabIndex={0}
          onKeyDown={(e) => {
            e.key === "Enter" && handleSelection(index);
          }}
        >
          <SearchResultCard item={place} type="place" index={index} />
        </div>
      ))}
    </div>
  );
};

export default SearchResultCardContainer;
