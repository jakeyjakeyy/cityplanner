import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./Map.css";
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

function NewMap({ tempMapItem, selections }: any) {
  // Default to Portland, OR
  let position = {
    lat: 45.515194,
    lng: -122.678379,
  };

  if (Object.keys(tempMapItem).length === 0) {
    if (selections.length > 0) {
      position = {
        lat: selections[selections.length - 1].location.latitude,
        lng: selections[selections.length - 1].location.longitude,
      };
      return (
        <div className="mapContainer">
          <APIProvider apiKey={apiKey || ""}>
            <Map
              className="map"
              center={position}
              zoom={12}
              styles={darkModeStyle}
            />
          </APIProvider>
        </div>
      );
    }
    return <div></div>;
  } else {
    let positionOrigin = null;
    let zoom = 16;
    console.log(position);
    if (tempMapItem.location) {
      position = {
        lat: tempMapItem.location.latitude,
        lng: tempMapItem.location.longitude,
      };
    }
    if (tempMapItem.apiType) {
      position = {
        lat: parseFloat(
          tempMapItem._embedded
            ? tempMapItem._embedded.venues[0].location.latitude
            : tempMapItem.venue.location.lat
        ),
        lng: parseFloat(
          tempMapItem._embedded
            ? tempMapItem._embedded.venues[0].location.longitude
            : tempMapItem.venue.location.lon
        ),
      };
    }
    console.log(position);
    if (selections.length > 0) {
      positionOrigin = {
        lat: selections[selections.length - 1].location.latitude,
        lng: selections[selections.length - 1].location.longitude,
      };
    }
    return (
      <div className="mapContainer">
        <APIProvider apiKey={apiKey || ""}>
          <Map className="map" center={position} zoom={zoom}>
            <Marker position={position} />
            {positionOrigin ? <Marker position={positionOrigin} /> : <p></p>}
          </Map>
        </APIProvider>
      </div>
    );
  }
}

export default NewMap;
