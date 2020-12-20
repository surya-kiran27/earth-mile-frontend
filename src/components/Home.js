import React, { useEffect, useState } from "react";
import { loginUser, useAuthDispatch, useAuthState } from "../Context";

export default function Home(props) {
  const { user } = useAuthState(); //read the values of loading and errorMessage from context
  const dispatch = useAuthDispatch(); //get the dispatch method from the useDispatch custom hook

  useEffect(() => {
    console.log(user);
    if (user === "") {
      async function login() {
        let response = await loginUser(dispatch);
        if (!response.user) props.history.push("/login");
      }
      login();
    }
  }, [user, dispatch, props]);

  useEffect(() => {
    if (user.earth_mile_id !== "") {
    } else {
    }
  });
  return <div>Hellow World</div>;
}
