import React from "react";

const defaultMapSrc = `https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&center=45.515194,-122.678379&zoom=13`;
let mapSrc = defaultMapSrc;
function Map({ tempMapItem, selections, itinerary }: any) {
  // If item is a ticketmaster event, we 'convert' it to the same format as google places
  if (tempMapItem.name) {
    console.log("tempMapItem", tempMapItem);
    tempMapItem.displayName = {
      text: tempMapItem.short_title,
    };
    tempMapItem.location = {
      latitude: tempMapItem._embedded.venues[0].location.latitude,
      longitude: tempMapItem._embedded.venues[0].location.longitude,
    };
    tempMapItem.formattedAddress =
      tempMapItem._embedded.venues[0].address.line1 +
      ", " +
      tempMapItem._embedded.venues[0].city.name +
      ", " +
      tempMapItem._embedded.venues[0].state.name;
    console.log("tempMapItem Updated", tempMapItem);
  }
  // Same for seatgeek
  if (tempMapItem.title) {
    tempMapItem.displayName = {
      text: tempMapItem.title,
    };
    tempMapItem.location = {
      latitude: tempMapItem.venue.location.lat,
      longitude: tempMapItem.venue.location.lon,
    };
    tempMapItem.formattedAddress =
      tempMapItem.venue.address + ", " + tempMapItem.venue.extended_address;
  }
  if (
    Object.keys(tempMapItem).length > 0 &&
    Object.keys(selections).length === 0
  ) {
    mapSrc = `https://www.google.com/maps/embed/v1/place?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&q=${encodeURIComponent(tempMapItem.formattedAddress)}`;
    console.log(mapSrc);
  }
  if (Object.keys(selections).length === 1 && tempMapItem) {
    if (tempMapItem.name === selections[0].name) {
      // if only one selection has been made and no new tempMapItem has been selected, show just the selections
      mapSrc = `https://www.google.com/maps/embed/v1/place?key=${
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }&q=${encodeURIComponent(tempMapItem.formattedAddress)}`;
    } else {
      // else display selection and tempMapItem
      mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }&origin=${encodeURIComponent(
        selections[selections.length - 1].formattedAddress
      )}&destination=${tempMapItem.location.latitude},${
        tempMapItem.location.longitude
      }`;
    }
  }
  if (Object.keys(selections).length === 2) {
    if (Object.keys(tempMapItem).length > 0) {
      mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }&origin=${encodeURIComponent(
        selections[0].formattedAddress
      )}&destination=${encodeURIComponent(
        tempMapItem.formattedAddress
      )}&waypoints=${selections[1].location.latitude},${
        selections[1].location.longitude
      }`;
    } else {
      mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }&origin=${encodeURIComponent(
        selections[0].formattedAddress
      )}&destination=${selections[selections.length - 1].formattedAddress}`;
    }
  }
  if (Object.keys(selections).length > 2) {
    mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&origin=${encodeURIComponent(
      selections[selections.length - 1].displayName.text
    )}%20${encodeURIComponent(
      selections[selections.length - 1].formattedAddress
    )}&destination=${tempMapItem.location.latitude},${
      tempMapItem.location.longitude
    }`;
  }

  if (
    Object.keys(itinerary).length > 1 &&
    Object.keys(itinerary).length === Object.keys(selections).length
  ) {
    mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&origin=${encodeURIComponent(
      selections[0].displayName.text
    )}%20${encodeURIComponent(
      selections[0].formattedAddress
    )}&destination=${encodeURIComponent(
      selections[selections.length - 1].formattedAddress
    )}&waypoints=`;
    for (let i = 1; i < selections.length - 1; i++) {
      mapSrc += `${encodeURIComponent(
        selections[i].location.latitude
      )},${encodeURIComponent(selections[i].location.longitude)}|`;
      mapSrc = mapSrc.slice(0, -1);
    }
  }

  if (Object.keys(tempMapItem).length === 0) {
    return <br></br>;
  }
  return (
    <iframe
      key={mapSrc}
      width="600"
      height="450"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={mapSrc}
    ></iframe>
  );
}

export default Map;
