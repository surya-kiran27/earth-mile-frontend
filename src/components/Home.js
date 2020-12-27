import React, { useEffect, useState } from "react";
import axios from "axios";
import { loginUser, useAuthDispatch, useAuthState } from "../Context";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import SwipeableViews from "react-swipeable-views";
import { Button, Container, Toolbar, Typography } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import PostCard from "../components/Post_Card";
import "../css/home.css";
export default function Home(props) {
  const location = useLocation();
  const dispatch = useAuthDispatch();
  const [value, setValue] = React.useState(0);
  const [earth_mile_id, setEarthMile_id] = useState(
    location.state && location.state.earth_mile_id !== undefined
      ? location.state.earth_mile_id
      : ""
  );

  const [earth_mile, setEarthMile] = useState(null);
  const [humans, setHumans] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [err, setErr] = useState("");

  const login = async () => {
    let response = await loginUser(dispatch);
    if (!response.user) props.history.push("/login");
  };
  useEffect(() => {
    login();
  }, []);
  useEffect(() => {
    async function getEarthMile() {
      let response = await axios.get(
        `http://localhost:8000/users/getEarthMile`
      );
      console.log(response, "get earth mile id");
      if (response.data.success) {
        setEarthMile_id(response.data.earth_mile_id);
      } else {
        setErr("Error fetching earth miles");
      }
    }
    if (earth_mile_id === "") getEarthMile();
  }, [earth_mile_id]);
  useEffect(() => {
    async function getEarthMile() {
      let response = await axios.get(
        `http://localhost:8000/earth-miles/earth-mile?id=${earth_mile_id}`
      );
      console.log(response, "get earthmile");
      if (response.data.success) {
        setEarthMile(response.data.earth_mile);
      } else {
        setErr("Error fetching earth miles");
      }
    }
    if (earth_mile_id !== "") getEarthMile();
  }, [earth_mile_id]);
  useEffect(() => {
    const category = ["humans", "animals", "environment"];
    console.log(`category ${category[value]}`);
    async function getPosts() {
      let response = await axios.get(
        `http://localhost:8000/earth-miles/Posts?id=${earth_mile_id}&category=${category[value]}`
      );
      console.log(response, "get posts");
      if (response.data.success) {
        if (value === 0) setHumans(response.data.posts);
        if (value === 1) setAnimals(response.data.posts);
        if (value === 2) setEnvironment(response.data.posts);
      } else {
        setErr("Error fetching earth miles");
      }
    }
    getPosts();
  }, [value]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div>
      {earth_mile_id === "" ? (
        <div>
          <h1>
            You have not joined any earth mile,{" "}
            <b>
              <a href="/earthMileMap">Click here</a>
            </b>{" "}
            to join now
          </h1>
        </div>
      ) : (
        <div style={{ width: "80%", margin: "auto", marginTop: "10px" }}>
          {earth_mile != null ? (
            <AppBar position="static" color="default">
              <Toolbar>
                <Container>
                  <Typography>
                    Project Name: <b>{earth_mile.name} </b>
                  </Typography>{" "}
                  <Typography>
                    Users: <b>{earth_mile.users.length}</b>
                  </Typography>{" "}
                  <Typography>
                    Posts:<b>{earth_mile.No_Posts}</b>
                  </Typography>{" "}
                  <Button variant="outlined" style={{ color: "red" }}>
                    View on map
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      props.history.push("/createPost", {
                        earth_mile_id,
                      });
                    }}
                  >
                    Create Post
                  </Button>
                </Container>
              </Toolbar>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Humans" />
                <Tab label="Animals" />
                <Tab label="Environment" />
              </Tabs>
              <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
                <TabPanel value={0} index={0}>
                  {humans.length === 0 ? (
                    <h3>There are no posts, create a post!</h3>
                  ) : (
                    humans.map((humanPost) => {
                      return (
                        <PostCard
                          username={humanPost.username}
                          createdAt={humanPost.createdAt}
                          title={humanPost.title}
                          description={humanPost.description}
                        ></PostCard>
                      );
                    })
                  )}
                </TabPanel>
                <TabPanel value={1} index={1}>
                  {animals.length === 0 ? (
                    <h3>There are no posts, create a post!</h3>
                  ) : (
                    animals.map((animalPost) => {
                      return (
                        <PostCard
                          username={animalPost.username}
                          createdAt={animalPost.createdAt}
                          title={animalPost.title}
                          description={animalPost.description}
                        ></PostCard>
                      );
                    })
                  )}
                </TabPanel>
                <TabPanel value={2} index={2}>
                  {environment.length === 0 ? (
                    <h3>There are no posts, create a post!</h3>
                  ) : (
                    environment.map((environmentPost) => {
                      return (
                        <PostCard
                          username={environmentPost.username}
                          createdAt={environmentPost.createdAt}
                          title={environmentPost.title}
                          description={environmentPost.description}
                        ></PostCard>
                      );
                    })
                  )}
                </TabPanel>
              </SwipeableViews>
            </AppBar>
          ) : (
            <div>
              <h1>Error occured, earth mile not found!</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
