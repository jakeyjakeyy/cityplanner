import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import "./Map.css";
import { FaMapMarkerAlt } from "react-icons/fa";
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

const Marker = ({ color, size }: any) => (
  <FaMapMarkerAlt color={color} size={size} />
);

function NewMap({ tempMapItem, selections }: any) {
  let positionOrigin: any = null;
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
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey || "" }}
            defaultCenter={position}
            defaultZoom={15}
          />
        </div>
      );
    }
    return <div></div>;
  } else {
    let zoom = 16;
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
    if (selections.length > 0) {
      let selection = selections[selections.length - 1];
      positionOrigin = {
        lat: selection.location?.latitude
          ? selection.location.latitude
          : selection.venue?.location.lat
          ? selection.venue.location.lat
          : selection._embedded.venues[0].location.latitude,
        lng: selection.location?.longitude
          ? selection.location.longitude
          : selection.venue?.location.lon
          ? selection.venue.location.lon
          : selection._embedded.venues[0].location.longitude,
      };
    }
    return (
      <div className="mapContainer">
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey || "" }}
          center={position}
          defaultZoom={15}
          options={{ styles: darkModeStyle }}
        >
          <Marker
            lat={position.lat}
            lng={position.lng}
            color="red"
            size={30}
            text="Placeholder"
          />
          {positionOrigin && (
            <Marker
              lat={positionOrigin.lat}
              lng={positionOrigin.lng}
              color="white"
              size={30}
              text="Placeholder"
            />
          )}
        </GoogleMapReact>
      </div>
    );
  }
}

export default NewMap;
