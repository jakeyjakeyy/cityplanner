async function GetTokens(username: String, password: String) {
  return fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (
        data.detail === "No active account found with the given credentials"
      ) {
        return "Invalid username or password.";
      }
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export default GetTokens;
