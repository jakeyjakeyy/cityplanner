import React, { useState, useEffect } from "react";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";

interface DisplayName {
  text: string;
  languageCode: string;
}

interface Place {
  types: string[];
  formattedAddress: string;
  websiteUri: string;
  displayName: DisplayName;
}

interface SearchResults {
  places: Place[];
}

interface SearchResult {
  searchResults: SearchResults;
}

const Conversation = () => {
  const [input, setInput] = React.useState("");
  const [thread, setThread] = React.useState("new");
  const [itinerary, setItinerary] = React.useState([]);
  const [location, setLocation] = React.useState("");
  const [currentResultIndex, setCurrentResultIndex] = React.useState(-1);
  const [selections, setSelections] = React.useState([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const handlePick = () => {
    setCurrentResultIndex(currentResultIndex + 1);
    console.log(currentResultIndex);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    ConversationAPI(input, thread).then((response) => {
      if (response.location && response.itinerary) {
        console.log(response);
        setItinerary(response.itinerary);
        setLocation(response.location);
        // setThread(response.thread);
        handlePick();
      }
    });
  };

  useEffect(() => {
    console.log(currentResultIndex);
    if (currentResultIndex < itinerary.length && currentResultIndex >= 0) {
      let query = location + " " + itinerary[currentResultIndex];
      searchItinerary(query).then((response) => {
        console.log(response);
        console.log("setting search results");
        setSearchResults(response);
      });
    }
  }, [currentResultIndex]);

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <div className="conversationContainer">
      <div className="searchResults">
        {searchResults?.searchResults?.places?.map((place: any) => (
          <div className="searchResultCard">
            <h2 className="placeName">{place.displayName.text}</h2>
            <p className="placeAddress">{place.formattedAddress}</p>
            <a href={place.websiteUri} className="placeWebsite">
              Visit Website
            </a>
            <p className="placeTypes">{place.types.join(", ")}</p>
          </div>
        ))}
      </div>
      <div className="inputField">
        <form onSubmit={handleSubmit}>
          <label>
            Input:
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default Conversation;
