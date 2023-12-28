import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";
import SearchResultCard from "./SearchResultCard";
import "./Conversation.css";

interface DisplayName {
  text: string;
  languageCode: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Place {
  types: string[];
  formattedAddress: string;
  websiteUri: string;
  displayName: DisplayName;
  location: Location;
}

interface SearchResults {
  places: Place[];
}

interface SearchResult {
  searchResults: SearchResults;
  events: any[];
}

const Conversation = ({
  setTempMapItem,
  selections,
  setSelections,
  itinerary,
  setItinerary,
}: any) => {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState("new");
  const [location, setLocation] = useState("");
  const [currentResultIndex, setCurrentResultIndex] = React.useState(-1);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [locationBias, setLocationBias] = useState({});
  const [message, setMessage] = useState("");
  const [priceLevels, setPriceLevels] = useState([]);

  // current result index is the index of the itinerary array that we are currently on
  // Allows us to search for each item in the itinerary
  const handlePick = () => {
    setCurrentResultIndex(currentResultIndex + 1);
    console.log(currentResultIndex);
  };

  // Communication with assistant API
  const handleSubmit = (event: any) => {
    event.preventDefault();
    ConversationAPI(input, thread).then((response) => {
      if (response.location && response.itinerary) {
        console.log(response);
        setItinerary(response.itinerary);
        setLocation(response.location);
        setThread(response.thread);
        handlePick();
      }
    });
  };

  // User selects preferred place from search results
  const handleSelection = (event: any) => {
    event.preventDefault();
    console.log(searchResults);
    console.log(searchResults?.searchResults?.places[event.target.id]);
    const place = searchResults?.searchResults?.places[event.target.id];

    if (place) {
      setSelections([...selections, place]);
      setLocationBias({
        latitude: place.location.latitude,
        longitude: place.location.longitude,
      });
      handlePick();
    }
  };
  const handleSelectionEvent = (event: any) => {
    event.preventDefault();
    console.log(searchResults);
    console.log(searchResults?.events[event.target.id]);
    const eventResult = searchResults?.events[event.target.id];

    if (eventResult) {
      setSelections([...selections, eventResult]);
      setLocationBias({
        latitude: eventResult.venue.location.lat,
        longitude: eventResult.venue.location.lon,
      });
      handlePick();
    }
  };

  // Search for next item in itinerary in a radius of last selected place
  useEffect(() => {
    console.log(currentResultIndex);
    if (currentResultIndex < itinerary.length && currentResultIndex >= 0) {
      let query = location + " " + itinerary[currentResultIndex];
      searchItinerary(query, priceLevels, location, locationBias).then(
        (response) => {
          console.log(response);
          setSearchResults(response);
        }
      );
    } else if (searchResults !== null) {
      ConversationAPI("", thread, selections).then((response) => {
        console.log(response);
        if (response.message) {
          setMessage(response.message[0][2][1][0][0][1][1][1]);
        }
      });
      setSearchResults(null);
    }
  }, [currentResultIndex]);

  const handleMouseEnter = (index: number) => {
    setTempMapItem(
      searchResults?.searchResults
        ? searchResults.searchResults.places[index]
        : searchResults?.events[index]
    );
  };

  // debugging
  useEffect(() => {
    console.log(setTempMapItem);
  }, [setTempMapItem]);

  return (
    <div className="conversationContainer">
      {searchResults == null ? (
        <div className="titleContainer">
          <h1>City Trip Planner</h1>
          <p>"Fun night with friends in Portland"</p>
        </div>
      ) : (
        <p></p>
      )}
      <div className="inputField">
        <form onSubmit={handleSubmit}>
          <input
            id="input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <div className="submit" onClick={handleSubmit}>
            Submit
          </div>
        </form>
      </div>
      <div className="message">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
      <div className="searchResultsContainer">
        <p className="placeName">{itinerary[currentResultIndex]}</p>
        <div className="searchResults">
          {searchResults?.searchResults
            ? searchResults.searchResults.places.map(
                (place: any, index: number) => (
                  <div
                    className="searchResultCardContainer"
                    key={place.displayName.text}
                    onClick={handleSelection}
                    id={searchResults?.searchResults?.places
                      ?.indexOf(place)
                      ?.toString()}
                    onMouseEnter={() => handleMouseEnter(index)}

                    // onMouseLeave={() => setTempMapItem({})}
                  >
                    <SearchResultCard item={place} type="place" />
                  </div>
                )
              )
            : searchResults?.events.map((event: any, index: number) => (
                <div
                  className="eventResultCard"
                  id={index.toString()}
                  onClick={handleSelectionEvent}
                  onMouseEnter={() => handleMouseEnter(index)}
                >
                  <SearchResultCard item={event} type="event" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
