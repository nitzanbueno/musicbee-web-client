import React from "react";
import "./App.css";
import Controller from "./Windows/Controller";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({ palette: { type: "dark", primary: { main: "#7986cb" } } });

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Controller />
        </MuiThemeProvider>
    );
}

export default App;
