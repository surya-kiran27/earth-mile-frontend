import React, { useState } from "react";
import "../css/navbar.css";
import { Button, Container, Icon } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import { useAuthState, useAuthDispatch, logout } from "../Context";
import Typography from "@material-ui/core/Typography";

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
        <Button className="icon" onClick={() => setToggle(!toggle)}>
          <Icon className="fa fa-bars"></Icon>
        </Button>
        {user !== "" ? (
          <Avatar className="avatar" alt="Remy Sharp" src={user.image} />
        ) : (
          ""
        )}
        {user !== "" ? (
          <Typography
            variant="overline"
            className="name"
            display="block"
            gutterBottom
          >
            Welcome <b>{user.username}</b>
          </Typography>
        ) : (
          ""
        )}
        {user !== "" ? (
          <a
            href="javascript:void(0)"
            className="a"
            onClick={() => logout(dispatch)}
          >
            Logout
          </a>
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
      </div>
    </div>
  );
}
