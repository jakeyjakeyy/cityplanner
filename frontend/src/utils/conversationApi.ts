import RefreshToken from "./refreshtoken";

async function ConversationAPI(
  input: String,
  thread: String,
  selections: any[] = []
): Promise<any> {
  return fetch("http://localhost:8000/api/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ input, thread, selections }),
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
