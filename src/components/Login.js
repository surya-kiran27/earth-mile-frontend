import React from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

export default function Login() {
  return (
    <div>
      <Container style={{ marginTop: "20%" }}>
        <center>
          <h1>Login</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.location.href = "http://localhost:8000/users/login/google";
            }}
          >
            Google Login
          </Button>
        </center>
      </Container>
    </div>
  );
}
