import React from "react";
import "./App.css";
import Controller from "./Controller";
import { createMuiTheme, makeStyles, MuiThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({});

const useStyles = makeStyles({
    container: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});

function App() {
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.container}>
                <Controller />
            </div>
        </MuiThemeProvider>
    );
}

export default App;
