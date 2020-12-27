import React from "react";
import Login from "../components/Login";
import Home from "../components/Home";
import EarthMileMap from "../components/EarthMileMap";
import CreatePost from "../components/CreatePost";
const routes = [
  {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  {
    path: "/earthMileMap",
    component: EarthMileMap,
    isPrivate: true,
  },
  {
    path: "/createPost",
    component: CreatePost,
    isPrivate: true,
  },
  {
    path: "/",
    component: Home,
    isPrivate: false,
  },

  //   {
  //     path: "/*",
  //     component: NotFound,
  //     isPrivate: true,
  //   },
];

export default routes;
