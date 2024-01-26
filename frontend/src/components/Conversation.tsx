import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";
import SearchResultCardContainer from "./SearchResultsContainer";
import "./Conversation.css";
import { SlReload } from "react-icons/sl";
import { IoSendSharp } from "react-icons/io5";

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

  // Search for next item in itinerary in a radius of last selected place
  useEffect(() => {
    console.log(currentResultIndex);
    console.log(itinerary);
    if (currentResultIndex < itinerary.length && currentResultIndex >= 0) {
      setSearchResultsLoading(true);
      let query = location + " " + itinerary[currentResultIndex];
      searchItinerary(query, location, locationBias).then((response) => {
        setSearchResultsLoading(false);
        console.log(response);
        setSearchResults(response);
      });
    } else if (searchResults !== null) {
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

  // Set temp map item to first search result.
  // This is used mainly to display the map when the user first searches for a location
  // as the map is not displayed on initial load
  useEffect(() => {
    if (searchResults) {
      setTempMapItem(searchResults?.searchResults.places[0]);
    }
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
