import React from "react";
import ReactDOM from "react-dom";
import routes from "./config/routes";
import AppRoute from "./components/AppRoute";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from "./Context/context";
import Navbar from "./components/Navbar";
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Navbar></Navbar>
        <Switch>
          {routes.map((route) => (
            <AppRoute
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
            />
          ))}
        </Switch>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
