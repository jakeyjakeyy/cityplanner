import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";
import SearchResultCardContainer from "./SearchResultsContainer";
import "./Conversation.css";
import { SlReload } from "react-icons/sl";
import { IoSendSharp } from "react-icons/io5";
import { GrUndo } from "react-icons/gr";
import { FaArrowCircleRight } from "react-icons/fa";

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
  tempMapItem,
}: any) => {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState("new");
  const [location, setLocation] = useState("");
  const [currentResultIndex, setCurrentResultIndex] = React.useState(-1);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [locationBias, setLocationBias] = useState({});
  const [message, setMessage] = useState("");
  const [directionsURL, setDirectionsURL] = useState("");
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [storedSearchResults, setStoredSearchResults] = useState<{
    [key: number]: any;
  }>({});
  const [prevStateResultIndex, setPrevStateResultIndex] = useState(-1);

  const resetConversation = () => {
    setInput("");
    setThread("new");
    setLocation("");
    setCurrentResultIndex(-1);
    setSearchResults(null);
    setLocationBias({});
    setMessage("");
    setSelections({});
    setItinerary([]);
    setTempMapItem({});
    setDirectionsURL("");
    setQueryMessage("");
    setStoredSearchResults({});
  };

  // current result index is the index of the itinerary array that we are currently on
  // Allows us to search for each item in the itinerary
  const handlePick = () => {
    setCurrentResultIndex(currentResultIndex + 1);
  };

  // Communication with assistant API
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (input === "") {
      return;
    }
    ConversationAPI(input, thread).then((response) => {
      console.log(response);
      if (response.location && response.itinerary) {
        console.log(response);
        setMessage("");
        setSelections({});
        setSearchResults(null);
        setTempMapItem({});
        setLocationBias({});
        setItinerary(response.itinerary);
        setLocation(response.location);
        setThread(response.thread);
        if (currentResultIndex === -1) {
          handlePick();
        } else {
          setCurrentResultIndex(0);
        }
      } else if (response.message) {
        setQueryMessage(response.message[0][2][1][0][0][1][1][1]);
        setThread(response.message[0][9][1]);
        setInput("");
      }
    });
  };

  // User selects preferred place from search results
  const handleSelection = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(selections);
    const place = searchResults?.searchResults?.places[event.target.id];

    if (place) {
      let newSelections = selections;
      let itineraryItem = itinerary[currentResultIndex];
      newSelections[itineraryItem] = place;
      setSelections(newSelections);
      setLocationBias({
        latitude: place.location.latitude,
        longitude: place.location.longitude,
      });
      handlePick();
    }
  };
  const handleSelectionEvent = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(selections);
    const eventResult = searchResults?.events[event.currentTarget.id];

    if (eventResult) {
      let newSelections = selections;
      let itineraryItem = itinerary[currentResultIndex];
      newSelections[itineraryItem] = eventResult;
      setSelections(newSelections);
      // set location for both seatgeek and ticketmaster results
      if (eventResult.venue?.location.lat) {
        setLocationBias({
          latitude: eventResult.venue.location.lat,
          longitude: eventResult.venue.location.lon,
        });
      } else {
        setLocationBias({
          latitude: eventResult._embedded.venues[0].location.latitude,
          longitude: eventResult._embedded.venues[0].location.longitude,
        });
      }
      handlePick();
    }
  };

  // This is used to move through the itinerary and display it's relative
  // search results
  useEffect(() => {
    console.log(currentResultIndex);
    console.log(itinerary);
    if (currentResultIndex < itinerary.length && currentResultIndex >= 0) {
      // User is moving through the itinerary,
      // with active search results on their screen
      if (currentResultIndex < prevStateResultIndex) {
        // Going back to previous result
        setSearchResults(storedSearchResults[currentResultIndex]);
      } else if (!storedSearchResults[currentResultIndex]) {
        // Else user is moving forward in the itinerary,
        // and we need to search for the next item
        setSearchResultsLoading(true);
        let query = location + " " + itinerary[currentResultIndex];
        searchItinerary(query, location, locationBias).then((response) => {
          setSearchResultsLoading(false);
          console.log(response);
          setSearchResults(response);
        });
      } else {
        // we already have the search results stored, no need to search again
        setSearchResults(storedSearchResults[currentResultIndex]);
      }
    } else if (searchResults !== null) {
      // User has reached the end of the itinerary
      console.log(selections);
      setSearchResultsLoading(true);
      ConversationAPI("", thread, selections).then((response) => {
        console.log(response);
        if (response.message) {
          setSearchResultsLoading(false);
          setMessage(response.message[0][2][1][0][0][1][1][1]);
        }
      });
      setSearchResults(null);
    }
    setPrevStateResultIndex(currentResultIndex);
  }, [currentResultIndex]);

  const handleMouseEnter = (index: number, type: string) => {
    if (type === "place") {
      setTempMapItem(searchResults?.searchResults.places[index]);
    } else {
      setTempMapItem(searchResults?.events[index]);
    }
  };

  // Display directions link when itinerary is complete
  useEffect(() => {
    if (message) {
      let url = "https://www.google.com/maps/dir/";
      for (let i = 0; i < selections.length; i++) {
        let selection = selections[i];
        if (selection.formattedAddress) {
          url += selection.formattedAddress + "/";
          continue;
        }
        let lng = selection.location?.longitude
          ? selection.location.longitude
          : selection.venue?.location.lon
          ? selection.venue.location.lon
          : selection._embedded.venues[0].location.longitude;
        let lat = selection.location?.latitude
          ? selection.location.latitude
          : selection.venue?.location.lat
          ? selection.venue.location.lat
          : selection._embedded.venues[0].location.latitude;
        url += lat + "," + lng + "/";
      }
      setDirectionsURL(url);
    }
  }, [message]);

  useEffect(() => {
    if (searchResults) {
      // Set temp map item to first search result.
      // This is used mainly to display the map when the user first searches for a location
      // as the map is not displayed on initial load
      setTempMapItem(searchResults?.searchResults.places[0]);

      // store search results in case user wants to go back to previous results
      let newStoredSearchResults: { [key: number]: any } = storedSearchResults;
      newStoredSearchResults[currentResultIndex] = searchResults;
      setStoredSearchResults(newStoredSearchResults);
    }
    console.log(storedSearchResults);
  }, [searchResults]);

  return (
    <div
      className={
        searchResults || message !== ""
          ? "conversationContainer"
          : "conversationContainerNoMap"
      }
    >
      {searchResults == null && message === "" ? (
        <div className="titleContainer">
          <h1 id="titleText">City Trip Planner</h1>
          <p>"Fun night with friends in Portland"</p>
        </div>
      ) : (
        <p></p>
      )}
      {queryMessage ? (
        <div className="queryMessage">
          <ReactMarkdown>{queryMessage}</ReactMarkdown>
        </div>
      ) : (
        <p></p>
      )}
      <div className="inputField">
        <div className="inputTextContainer">
          <div className="inputText">
            <input
              id="input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit(event);
                }
              }}
            />
          </div>
          <div className="inputIconContainer">
            <div className="submit" onClick={handleSubmit}>
              <IoSendSharp color="black" size={20} />
            </div>
            <div className="reset" onClick={resetConversation}>
              <SlReload color="black" size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="message">
        <ReactMarkdown>{message}</ReactMarkdown>
        {directionsURL ? (
          <div id="directionsLink">
            <a href={directionsURL}>Directions</a>
          </div>
        ) : (
          <p></p>
        )}
      </div>
      <p className="itineraryItem">{itinerary[currentResultIndex]}</p>
      {currentResultIndex > 0 && currentResultIndex < itinerary.length ? (
        <div
          className="undo"
          onClick={() => setCurrentResultIndex(currentResultIndex - 1)}
        >
          <GrUndo color="black" size={20} />
        </div>
      ) : (
        <div></div>
      )}
      {currentResultIndex >= 0 && currentResultIndex < itinerary.length - 1 ? (
        <div
          className="next"
          onClick={() => setCurrentResultIndex(currentResultIndex + 1)}
        >
          <FaArrowCircleRight color="black" size={20} />
        </div>
      ) : (
        <div></div>
      )}
      <SearchResultCardContainer
        searchResults={searchResults}
        handleSelection={handleSelection}
        handleSelectionEvent={handleSelectionEvent}
        handleMouseEnter={handleMouseEnter}
        searchResultsLoading={searchResultsLoading}
      />
    </div>
  );
};

export default Conversation;
