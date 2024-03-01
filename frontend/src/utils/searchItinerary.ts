async function searchItinerary(
  query: String,
  location: String,
  locationBias?: {}
): Promise<any> {
  return fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, location, locationBias }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export default searchItinerary;
