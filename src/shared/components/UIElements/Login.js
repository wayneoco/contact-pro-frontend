import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from "@mui/material/Button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="contained"
      sx={{ mx: "auto", mt: 2, width: 200 }}
      onClick={() => loginWithRedirect()}
    >
      Log In / Sign Up
    </Button>
  );
};

export default LoginButton;
