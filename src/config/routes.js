import React from "react";
import Login from "../components/Login";
import Home from "../components/Home";
import EarthMileMap from "../components/EarthMileMap";
const routes = [
  {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  {
    path: "/earthMileMap",
    component: EarthMileMap,
    isPrivate: false,
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
