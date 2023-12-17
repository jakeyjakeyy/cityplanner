import React from "react";

const defaultMapSrc = `https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&center=45.515194,-122.678379&zoom=13`;
let mapSrc = defaultMapSrc;
function Map({ tempMapItem, selections }: any) {
  if (
    Object.keys(tempMapItem).length > 0 &&
    Object.keys(selections).length === 0
  ) {
    mapSrc = `https://www.google.com/maps/embed/v1/place?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&q=${encodeURIComponent(tempMapItem.displayName.text)} ${
      tempMapItem.formattedAddress
    }`;
    console.log(mapSrc);
  }
  if (Object.keys(selections).length === 1) {
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
  if (Object.keys(selections).length === 2) {
    mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&origin=${encodeURIComponent(
      selections[selections.length - 1].displayName.text
    )}%20${encodeURIComponent(
      selections[selections.length - 1].formattedAddress
    )}&destination=${selections[0].location.latitude},${
      selections[0].location.longitude
    }`;
  }
  if (Object.keys(selections).length > 2) {
    mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }&origin=${encodeURIComponent(
      selections[selections.length - 1].displayName.text
    )}%20${encodeURIComponent(
      selections[selections.length - 1].formattedAddress
    )}&destination=${selections[0].location.latitude},${
      selections[0].location.longitude
    }&waypoints=`;
    for (let i = 1; i < selections.length - 1; i++) {
      mapSrc += `${selections[i].location.latitude},${selections[i].location.longitude}|`;
    }
    mapSrc = mapSrc.slice(0, -1);
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
