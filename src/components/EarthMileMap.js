import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuthState } from "../Context";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Circle,
  LayerGroup,
  Tooltip,
  Marker,
} from "react-leaflet";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import Button from "@material-ui/core/Button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;
export default function EarthMileMap(props) {
  const [earth_mile_id, setEarthMile] = useState("");
  const [position, setPosition] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: "", lng: "" });
  const [earthMiles, setEarthMiles] = useState([]);
  const [err, setErr] = useState("");
  const fillRed = { fillColor: "red" };
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          console.log(marker.getLatLng());
          setMarkerPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        setPosition(position.coords);
        setMarkerPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function errorCallback(error) {
        console.log(error);
        alert("could not get your location");
      },
      {
        timeout: 5000,
        enableHighAccuracy: true,
      }
    );
  }, []);
  useEffect(() => {
    async function getEarthMile() {
      let response = await axios.get(
        `http://localhost:8000/users/getEarthMile`
      );
      console.log(response);
      if (response.data.success) {
        setEarthMile(response.data.earth_mile_id);
      } else {
        setErr("Error fetching earth miles");
      }
    }
    getEarthMile();
  }, [earth_mile_id]);
  useEffect(() => {
    if (position != null) {
      async function getEarthMiles() {
        const { latitude, longitude } = position;
        let response = await axios.get(
          `http://localhost:8000/earth-miles?coordinates=${longitude},${latitude}`
        );
        console.log(response);
        if (response.data.success) {
          setEarthMiles(response.data.earth_miles);
        } else {
          setErr("Error fetching earth miles");
        }
      }
      getEarthMiles();
    }
  }, [position]);
  return (
    <Container>
      <center>
        <h1>Earth Miles Around you</h1>
      </center>

      {position != null ? (
        <div>
          <MapContainer
            center={{ lat: position.latitude, lng: position.longitude }}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "80vh" }}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LayerGroup>
              {earthMiles.map((earthMile) => {
                return (
                  <Circle
                    center={[earthMile.location[1], earthMile.location[0]]}
                    pathOptions={fillRed}
                    radius={1609}
                  >
                    <Tooltip>
                      <Container>
                        <center>
                          <Typography
                            variant="overline"
                            display="block"
                            gutterBottom
                          >
                            Users: <b>{earthMile.users.length}</b>
                          </Typography>
                          <br />
                          <Typography
                            variant="overline"
                            display="block"
                            gutterBottom
                          >
                            Posts: <b>{earthMile.posts.length}</b>
                          </Typography>
                          <br />
                          <Typography
                            variant="overline"
                            display="block"
                            gutterBottom
                          >
                            Created
                            <b>
                              {" "}
                              <Moment
                                fromNow
                                date={earthMile.createdAt}
                              ></Moment>
                            </b>
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              window.location.href =
                                "http://localhost:8000/users/login/google";
                            }}
                          >
                            View
                          </Button>
                        </center>
                      </Container>
                    </Tooltip>
                  </Circle>
                );
              })}
              <Marker
                position={{ lat: position.latitude, lng: position.longitude }}
                draggable={false}
              ></Marker>
              <Circle
                center={[markerPosition.lat, markerPosition.lng]}
                pathOptions={fillRed}
                radius={1609}
              ></Circle>
              <Marker
                position={markerPosition}
                ref={markerRef}
                draggable={true}
                eventHandlers={eventHandlers}
              ></Marker>
            </LayerGroup>
            {earth_mile_id === "" ? (
              <Button
                style={{
                  float: "right",
                  zIndex: "999",
                  margin: "5px",
                  position: "relative",
                }}
                variant="contained"
                color="primary"
              >
                Create Earth Mile
              </Button>
            ) : (
              ""
            )}
          </MapContainer>
        </div>
      ) : (
        ""
      )}
    </Container>
  );
}
