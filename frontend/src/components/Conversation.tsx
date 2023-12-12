import React, { useState } from "react";
import ConversationAPI from "../utils/conversationApi";

const Conversation = () => {
  const [input, setInput] = React.useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    ConversationAPI(input).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
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
  );
};

export default Conversation;
