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
  MapConsumer,
  Popup,
} from "react-leaflet";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import Button from "@material-ui/core/Button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [28, 40],
  iconAnchor: [14, 20],
  shadowUrl: iconShadow,
});

export default function EarthMileMap(props) {
  const [earth_mile_id, setEarthMile] = useState("");
  const [position, setPosition] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: "", lng: "" });
  const [create, setCreate] = useState(false);
  const [earthMiles, setEarthMiles] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [redirect, setRedirect] = useState({ redirect: false, state: null });
  const [err, setErr] = useState("");
  const fillRed = { fillColor: "red" };
  const fillBlue = { fillColor: "blue" };
  const fillGreen = { fillColor: "green" };
  const circleRef = useRef(null);
  let history = useHistory();

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
                    pathOptions={fillBlue}
                    radius={1609}
                  >
                    <Popup>
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
                            Posts: <b>{earthMile.No_Posts}</b>
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
                              console.log("cliecked", earthMile._id);
                              history.push({
                                pathname: "/",
                                state: {
                                  earth_mile_id: earthMile._id,
                                },
                              });
                            }}
                          >
                            View
                          </Button>
                        </center>
                      </Container>
                    </Popup>
                  </Circle>
                );
              })}
              <Marker
                position={{ lat: position.latitude, lng: position.longitude }}
                draggable={false}
                title="Your location"
                icon={DefaultIcon}
              ></Marker>

              {earth_mile_id === "" ? (
                <MapConsumer>
                  {(map) => {
                    map.on("mouseup", function (e) {
                      map.dragging.enable();

                      map.removeEventListener("mousemove");
                    });
                    return (
                      <div>
                        <Circle
                          center={{
                            lat: position.latitude,
                            lng: position.longitude,
                          }}
                          pathOptions={fillGreen}
                          radius={1609}
                        ></Circle>
                        <Circle
                          center={[markerPosition.lat, markerPosition.lng]}
                          pathOptions={fillRed}
                          radius={1300}
                          ref={circleRef}
                          eventHandlers={{
                            mousedown: function () {
                              map.dragging.disable();
                              map.on("mousemove", function (e) {
                                setMarkerPosition({
                                  lat: e.latlng.lat,
                                  lng: e.latlng.lng,
                                });
                              });
                            },
                          }}
                        ></Circle>
                      </div>
                    );
                  }}
                </MapConsumer>
              ) : (
                ""
              )}
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
                onClick={() => {
                  setCreate(true);
                  setOpen(true);
                }}
                disabled={open ? true : false}
              >
                Click to create earth mile
              </Button>
            ) : (
              ""
            )}
          </MapContainer>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Earth Mile Details</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Enter Project Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                fullWidth
              />
              <TextField
                margin="dense"
                id="address"
                label="Enter Address"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (name === "") {
                    alert("Project Name cannot be empty");
                    return;
                  }

                  if (address === "") {
                    alert("Earth mile address cannot be empty");
                    return;
                  }
                  const data = {
                    coordinates: `${markerPosition.lng},${markerPosition.lat}`,
                    address,
                    name,
                  };
                  try {
                    let res = await axios.post(
                      "http://localhost:8000/earth-miles/create",
                      data
                    );
                    console.log(res);
                    if (res.data.success) {
                      alert("Earth Mile created successfully");
                    } else {
                      alert(`Earth Mile creation failed ${res.data.message}`);
                    }
                    setCreate(false);
                    setOpen(false);
                  } catch (error) {
                    alert("Error Occured!");
                  }
                }}
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        ""
      )}
    </Container>
  );
}
