import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import "./Map.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa6";
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

const Marker = ({ color, size, index }: any) => (
  <div id="markerWrapper">
    <div id="markerIndex">{index ? index : ""}</div>
    <FaMapMarkerAlt color={color} size={size} />
  </div>
);

function NewMap({ tempMapItem, selections, itinerary }: any) {
  console.log(selections);
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
  } else if (Object.keys(selections).length < Object.keys(itinerary).length) {
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
    if (
      selections.length > 0 &&
      selections.length < Object.keys(itinerary).length
    ) {
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
        <div className="map">
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
      </div>
    );
  } else if (
    Object.keys(selections).length === Object.keys(itinerary).length &&
    Object.keys(selections).length > 0
  ) {
    let zoom = 15;

    return (
      <div className="mapContainer">
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey || "" }}
          defaultCenter={position}
          defaultZoom={15}
          options={{ styles: darkModeStyle }}
        >
          {Object.values(selections).map((selection: any, index: number) => {
            if (typeof selection === "object" && selection.location) {
              return (
                <Marker
                  lat={
                    selection.location?.latitude
                      ? selection.location.latitude
                      : selection.venue?.location.lat
                      ? selection.venue.location.lat
                      : selection._embedded.venues[0].location.latitude
                  }
                  lng={
                    selection.location?.longitude
                      ? selection.location.longitude
                      : selection.venue?.location.lon
                      ? selection.venue.location.lon
                      : selection._embedded.venues[0].location.longitude
                  }
                  color="white"
                  size={30}
                  text="Placeholder"
                  index={index + 1}
                />
              );
            }
          })}
        </GoogleMapReact>
      </div>
    );
  }
  return <div></div>;
}

export default NewMap;
