const ROOT_URL = "http://localhost:8000";

export async function loginUser(dispatch) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  try {
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await fetch(
      `${ROOT_URL}/users/google/check`,
      requestOptions
    );
    let data = await response.json();
    if (data.user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      return data;
    } else {
      dispatch({ type: "LOGIN_ERROR", error: "Error Ocurred Try again!" });
    }

    return;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: "Error Ocurred Try again!" });
  }
}

export async function logout(dispatch) {
  dispatch({ type: "LOGOUT" });
  localStorage.removeItem("currentUser");
  let response = await fetch(`${ROOT_URL}/users/logout`);
}
