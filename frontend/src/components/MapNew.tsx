import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./Map.css";
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function NewMap({ tempMapItem }: any) {
  // Default to Portland, OR
  let position = {
    lat: 45.515194,
    lng: -122.678379,
  };

  if (Object.keys(tempMapItem).length === 0) {
    return (
      <APIProvider apiKey={apiKey || ""}>
        <Map className="map" center={position} zoom={12} />
      </APIProvider>
    );
  } else {
    position = {
      lat: tempMapItem.location.latitude,
      lng: tempMapItem.location.longitude,
    };
  }
  return (
    <APIProvider apiKey={apiKey || ""}>
      <Map className="map" center={position} zoom={16}>
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}

export default NewMap;
