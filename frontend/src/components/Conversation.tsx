import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";
import SearchResultCardContainer from "./Card/SearchResultsContainer";
import SearchResultCard from "./Card/SearchResultCard";
import ConfirmItinerary from "./ConfirmItinerary";
import QueryScroller from "./QueryScroller";
import "./Conversation.css";
import { SlReload } from "react-icons/sl";
import { IoSendSharp } from "react-icons/io5";
import { GrUndo } from "react-icons/gr";
import { FaArrowCircleRight } from "react-icons/fa";

const Conversation = ({
  setTempMapItem,
  selections,
  setSelections,
  itinerary,
  setItinerary,
  tempMapItem,
  currentResultIndex,
  setCurrentResultIndex,
  message,
  setMessage,
}: any) => {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState("new");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [locationBias, setLocationBias] = useState({});
  const [directionsURL, setDirectionsURL] = useState("");
  const [searchResultsLoading, setSearchResultsLoading] = useState(true);
  const [queryMessage, setQueryMessage] = useState("");
  const [storedSearchResults, setStoredSearchResults] = useState<{
    [key: number]: any;
  }>({});
  const [prevStateResultIndex, setPrevStateResultIndex] = useState(-1);
  var userConfirmed = false;
  const [userActivelyChangingItinerary, setUserActivelyChangingItinerary] =
    useState(false);
  const [newOrder, setNewOrder] = useState<any>([]);
  const [alternateLocations, setAlternateLocations] = useState<any>({});

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
    setPrevStateResultIndex(-1);
    setUserActivelyChangingItinerary(false);
    setNewOrder([]);
  };

  // current result index is the index of the itinerary array that we are currently on
  // Allows us to move forward and backward through the itinerary
  const handlePick = () => {
    setCurrentResultIndex(currentResultIndex + 1);
  };

  // Initial communication with assistant API when user enters a query
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (input === "") {
      return;
    }
    if (localStorage.getItem("token") === null) {
      alert("Please log in");
    }
    console.log("setting search results loading to true");
    setSearchResultsLoading(true);
    ConversationAPI(input, thread).then((response) => {
      if (response.location && response.itinerary) {
        // If we get a location and itinerary back from the assistant API,
        // we can start the search process
        setMessage("");
        setSelections({});
        setSearchResults(null);
        setTempMapItem({});
        setLocationBias({});
        setItinerary(response.itinerary);
        setLocation(response.location);
        setThread(response.thread);
        setAlternateLocations(response.alternates);

        // Between these steps before we update currentResultIndex(which will start the search process), we will let the user review the itinerary and make changes
        setUserActivelyChangingItinerary(true);
      } else if (response.message) {
        // Else we set the message from the assistant API to be displayed
        // The assistant is likely asking for more information
        setQueryMessage(response.message[0][2][1][0][0][1][1][1]);
        setThread(response.message[0][9][1]);
        setInput("");
      }
      console.log("setting search results loading to false");
      setSearchResultsLoading(false);
    });
  };

  // User selects preferred place from search results
  const handleSelection = (event: any) => {
    let place = null;
    if (typeof event === "number") {
      place = searchResults?.searchResults.places[event];
    } else {
      place = searchResults?.searchResults?.places[event.target.id];
    }

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

  // This is used to move through the itinerary and display it's relative search results
  useEffect(() => {
    console.log("currentResultIndex: " + currentResultIndex);
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
          setSearchResults(response);
        });
      } else {
        // we already have the search results stored, no need to search again
        setSearchResults(storedSearchResults[currentResultIndex]);
      }
    } else if (searchResults !== null) {
      // User has reached the end of the itinerary
      setSearchResultsLoading(true);
      ConversationAPI("", thread, selections, newOrder).then((response) => {
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

  // Generate directions link when itinerary is complete
  useEffect(() => {
    if (message) {
      console.log(selections);
      let url = "https://www.google.com/maps/dir/";
      Object.keys(selections).forEach((key) => {
        let selection = selections[key];
        if (selection.skip) {
          return;
        }
        if (selection.formattedAddress) {
          url += selection.formattedAddress + "/";
          return;
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
      });
      setDirectionsURL(url);
    }
  }, [message]);

  // Store search results
  useEffect(() => {
    if (searchResults) {
      // Set temp map item to first search result.
      // This is used mainly to display the map when the user first searches for a location
      // as the map is not displayed on initial load
      setTempMapItem(searchResults?.searchResults.places[0]);

      let newStoredSearchResults: { [key: number]: any } = storedSearchResults;
      newStoredSearchResults[currentResultIndex] = searchResults;
      setStoredSearchResults(newStoredSearchResults);
    }
  }, [searchResults]);

  const skipItem = () => {
    let newSelections = selections;
    let itineraryItem = itinerary[currentResultIndex];
    newSelections[itineraryItem] = {
      skip: "User skipped this item. Ignore it.",
    };
    setSelections(newSelections);
    handlePick();
  };

  useEffect(() => {
    if (window.location.pathname == "/history") {
      window.history.pushState(null, "", "/");
    }
  }, []);

  // debug
  useEffect(() => {
    console.log("loading: " + searchResultsLoading);
  }, [searchResultsLoading]);

  return (
    <div
      className={
        searchResults || message !== ""
          ? "conversationContainer"
          : "conversationContainerNoMap"
      }
    >
      {searchResults == null && message === "" && (
        <div className="titleContainer">
          <h1 id="titleText">City Trip Planner</h1>
          <QueryScroller />
        </div>
      )}
      {queryMessage && Object.keys(itinerary).length === 0 && (
        <div className="queryMessage">
          <ReactMarkdown>{queryMessage}</ReactMarkdown>
        </div>
      )}
      {itinerary.length === 0 ? (
        <div className="inputField">
          <div className="inputTextContainer">
            <div className="inputText">
              <input
                id="input"
                type="text"
                aria-label="Query Input"
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
              <div
                className="submit"
                onClick={handleSubmit}
                tabIndex={0}
                onKeyDown={(e) => {
                  e.key === "Enter" && handleSubmit(e);
                }}
              >
                <IoSendSharp color="black" size={20} aria-label="Submit" />
              </div>
              <div
                className="reset"
                onClick={resetConversation}
                tabIndex={0}
                onKeyDown={(e) => {
                  e.key === "Enter" && resetConversation();
                }}
              >
                <SlReload
                  color="black"
                  size={20}
                  aria-label="Reset Conversation"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="inputField">
          <div
            className="reset"
            onClick={resetConversation}
            aria-label="Reset Conversation"
            tabIndex={0}
            onKeyDown={(e) => {
              e.key === "Enter" && resetConversation();
            }}
          >
            <SlReload size={20} />
          </div>
        </div>
      )}
      {message !== "" && (
        <div className="message">
          <ReactMarkdown>{message}</ReactMarkdown>
          <div id="directionsLink">
            <a href={directionsURL}>Directions</a>
          </div>
        </div>
      )}

      {userActivelyChangingItinerary && (
        <ConfirmItinerary
          itinerary={itinerary}
          setItinerary={setItinerary}
          setUserActivelyChangingItinerary={setUserActivelyChangingItinerary}
          currentResultIndex={currentResultIndex}
          setCurrentResultIndex={setCurrentResultIndex}
          setNewOrder={setNewOrder}
          alternateLocations={alternateLocations}
        />
      )}
      {currentResultIndex >= 0 && currentResultIndex < itinerary.length && (
        <p className="itineraryItem">{itinerary[currentResultIndex]}</p>
      )}
      {currentResultIndex > 0 && currentResultIndex < itinerary.length && (
        <div
          className="undo"
          onClick={() => setCurrentResultIndex(currentResultIndex - 1)}
          tabIndex={0}
          onKeyDown={(e) => {
            e.key === "Enter" && setCurrentResultIndex(currentResultIndex - 1);
          }}
        >
          <GrUndo
            color="white"
            size={20}
            style={{ cursor: "pointer" }}
            aria-label="Undo Selection"
          />
        </div>
      )}
      {currentResultIndex >= 0 && currentResultIndex < itinerary.length && (
        <div
          className="next"
          onClick={skipItem}
          style={{ cursor: "pointer" }}
          tabIndex={0}
          onKeyDown={(e) => {
            e.key === "Enter" && skipItem();
          }}
        >
          <FaArrowCircleRight
            color="white"
            size={20}
            aria-label="Skip Selection"
          />
        </div>
      )}
      {currentResultIndex < itinerary.length ||
        (searchResultsLoading && (
          <SearchResultCardContainer
            searchResults={searchResults}
            handleSelection={handleSelection}
            handleSelectionEvent={handleSelectionEvent}
            handleMouseEnter={handleMouseEnter}
            searchResultsLoading={searchResultsLoading}
          />
        ))}
    </div>
  );
};

export default Conversation;
