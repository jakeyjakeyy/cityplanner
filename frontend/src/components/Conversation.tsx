import React, { useState, useEffect } from "react";
import ConversationAPI from "../utils/conversationApi";

const Conversation = () => {
  const [input, setInput] = React.useState("");
  const [thread, setThread] = React.useState("new");
  const [searchResults, setSearchResults] = React.useState<any>();
  const [itinerary, setItinerary] = React.useState([]);
  const [currentResultIndex, setCurrentResultIndex] = React.useState(0);

  const handlePick = () => {
    setCurrentResultIndex(currentResultIndex + 1);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    ConversationAPI(input, thread).then((response) => {
      if (response.searchResults && response.itinerary) {
        console.log(response);
        setSearchResults(response.searchResults);
        setItinerary(response.itinerary);
      }
    });
  };

  // useEffect(() => {});

  return (
    <div className="conversationContainer">
      <div className="searchResults">
        {searchResults &&
          Object.values(searchResults).flatMap((result: any) =>
            result.places.map((place: any) => (
              <div className="searchResult">
                <div className="searchResultTitle">
                  {place.displayName.text}
                </div>
                <div className="searchResultDescription">
                  {place.formattedAddress}
                </div>
              </div>
            ))
          )}
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
