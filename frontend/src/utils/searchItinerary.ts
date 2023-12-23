async function searchItinerary(
  query: String,
  priceLevels: Array<String>,
  locationBias?: {}
): Promise<any> {
  return fetch("http://localhost:8000/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, priceLevels, locationBias }),
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
