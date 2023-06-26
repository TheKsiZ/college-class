import React, { useContext } from "react";
import Router from "./components/Router";
import { Context } from "./index";
import { useAuthState } from "react-firebase-hooks/auth";
import { Box, CircularProgress } from "@mui/material";

const App = () => {
  const { auth } = useContext(Context);
  const [user, loading] = useAuthState(auth);
  if (loading) {
      return(
        <></>
      );
  }
  return(
    <>      
        <Router/>      
    </>
  );
}

export default App;
