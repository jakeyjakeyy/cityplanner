import RefreshToken from "./refreshtoken";

async function ConversationAPI(
  input: String,
  thread: String,
  selections: Record<string, any> = {},
  newOrder: Array<string> = []
): Promise<any> {
  return fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ input, thread, selections, newOrder }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code === "token_not_valid") {
        RefreshToken().then(() => {
          if (localStorage.getItem("token")) {
            return ConversationAPI(input, thread, selections);
          }
        });
      }
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export default ConversationAPI;
