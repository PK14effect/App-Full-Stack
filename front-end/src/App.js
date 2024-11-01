import React from "react";
import { Container, Typography } from "@mui/material";
import Tickets from "./component/ticket";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      Helpdesk support ticket management
      </Typography>
      <Tickets />
    </Container>
  );
}

export default App;
