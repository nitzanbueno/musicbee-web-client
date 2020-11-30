import React from "react";
import "./App.css";
import Controller from "./Controller";
import { createMuiTheme, makeStyles, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({ palette: { type: "dark" } });

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Controller />
        </MuiThemeProvider>
    );
}

export default App;
