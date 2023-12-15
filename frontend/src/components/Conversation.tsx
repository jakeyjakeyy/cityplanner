import React, { useState, useEffect } from "react";
import ConversationAPI from "../utils/conversationApi";
import searchItinerary from "../utils/searchItinerary";

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
}

const Conversation = () => {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState("new");
  const [itinerary, setItinerary] = useState([]);
  const [location, setLocation] = useState("");
  const [currentResultIndex, setCurrentResultIndex] = React.useState(-1);
  const [selections, setSelections] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [locationBias, setLocationBias] = useState({});

  // current result index is the index of the itinerary array that we are currently on
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
        setThread(response.thread);
        handlePick();
      }
    });
  };

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

  useEffect(() => {
    console.log(currentResultIndex);
    if (currentResultIndex < itinerary.length && currentResultIndex >= 0) {
      let query = location + " " + itinerary[currentResultIndex];
      searchItinerary(query, locationBias).then((response) => {
        setSearchResults(response);
      });
    } else if (searchResults !== null) {
      ConversationAPI("", thread, selections).then((response) => {
        console.log(response);
      });
      setSearchResults(null);
    }
  }, [currentResultIndex]);

  useEffect(() => {
    console.log(locationBias);
  }, [locationBias]);

  return (
    <div className="conversationContainer">
      <div className="searchResults">
        {searchResults?.searchResults?.places?.map((place: any) => (
          <div
            className="searchResultCard"
            key={place.displayName.text}
            onClick={handleSelection}
            id={searchResults?.searchResults?.places
              ?.indexOf(place)
              ?.toString()}
          >
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
