async function GetTokens(username: String, password: String) {
  return fetch("http://localhost:8000/api/token", {
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
        alert("Invalid username or password.");
        return;
      }
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export default GetTokens;
