import React from "react";

function Map({ tempMapItem }: any) {
  const defaultMapSrc = `https://www.google.com/maps/embed/v1/view?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&center=45.515194,-122.678379&zoom=13`;
  let mapSrc = defaultMapSrc;
  if (Object.keys(tempMapItem).length > 0) {
    mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${tempMapItem.displayName.text} ${tempMapItem.formattedAddress}`;
    console.log(mapSrc);
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
