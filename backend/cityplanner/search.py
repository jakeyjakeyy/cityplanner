# For file upload to openai
import requests
import re


def Search(searchType, query, locationBias, location):
    # searchType = "google" or "seatgeek"
    # query = the type of place or event
    # locationBias = the latitude and longitude of the previous selection
    # location = the city the user is searching in
    if searchType == "google":
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AIzaSyDP-p7uLlhwYKxYcxRokQxEJlVeEUkzcZg",
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.types,places.location,places.rating",
        }
        params = {
            "textQuery": query,
            "maxResultCount": "5",
        }
        if locationBias != {}:
            params = {
                "textQuery": query,
                "maxResultCount": "5",
                "locationBias": {
                    "circle": {
                        "center": locationBias,
                        "radius": 1000,
                    }
                },
            }

        res = requests.post(url, json=params, headers=headers)
        data = res.json()

        # If user is making their first selection we dont need a locationBias
        if not locationBias:
            return {"searchResults": data}
        # Otherwise we use the previous location as a locationBias to get close results
        for place in data["places"]:
            distance = requests.post(
                f"https://maps.googleapis.com/maps/api/directions/json?origin={locationBias['latitude']},{locationBias['longitude']}&destination={place['location']['latitude']},{place['location']['longitude']}&key=AIzaSyDP-p7uLlhwYKxYcxRokQxEJlVeEUkzcZg"
            )
            distance_text = distance.json()["routes"][0]["legs"][0]["duration"]["text"]
            distance_value = re.sub(r"\D", "", distance_text)
            place["distance"] = distance_value + " minutes drive"
            # show walking distance if less than 5 minutes drive
            if int(distance_value) < 3:
                distance = requests.post(
                    f"https://maps.googleapis.com/maps/api/directions/json?origin={locationBias['latitude']},{locationBias['longitude']}&destination={place['location']['latitude']},{place['location']['longitude']}&mode=walking&key=AIzaSyDP-p7uLlhwYKxYcxRokQxEJlVeEUkzcZg"
                )
                distance_text = distance.json()["routes"][0]["legs"][0]["duration"][
                    "text"
                ]
                place["distance"] = distance_value + " minutes walk"

        return {"searchResults": data}
    if searchType == "seatgeek":
        url = "https://api.seatgeek.com/2/events"
        params = {
            "client_id": "MzkwODk0NzN8MTcwMzM3MDkyMS45NDk0MzMz",
            "q": location,
            "per_page": 5,
        }
        res = requests.get(url, params=params)
        data = res.json()
        return {"events": data["events"]}
