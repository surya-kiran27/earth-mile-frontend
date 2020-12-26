import React, { useState } from "react";
import "../css/navbar.css";
import { Button, Icon } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { useAuthState, useAuthDispatch, logout } from "../Context";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const { user } = useAuthState();
  const dispatch = useAuthDispatch(); //get the dispatch method from the useDispatch custom hook

  return (
    <div>
      <div className={!toggle ? "topnav" : "topnav responsive"} id="myTopnav">
        <NavLink exact to="/" className="a" activeClassName="active">
          Home
        </NavLink>

        <NavLink
          exact
          to="/earthMileMap"
          className="a"
          activeClassName="active"
        >
          Map
        </NavLink>
        <NavLink exact to="/profile" className="a" activeClassName="active">
          Profile
        </NavLink>
        {user !== "" ? <Avatar alt="Remy Sharp" src={user.image} /> : ""}
        {user !== "" ? (
          <Button className="icon" onClick={() => logout(dispatch)}>
            Logout
          </Button>
        ) : (
          ""
        )}
        {user === "" ? (
          <NavLink exact to="/login" className="a" activeClassName="active">
            Login
          </NavLink>
        ) : (
          ""
        )}
        <Button className="icon" onClick={() => setToggle(!toggle)}></Button>
      </div>
    </div>
  );
}
