import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";
import NowPlaying from "./NowPlaying";

const useStyles = makeStyles({
    container: {
        width: "80%",
        height: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    playbarContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    playbar: {
        margin: "0px 20px",
    },
});

const Controller: React.FC<{}> = () => {
    const [state, dispatch] = useReducer(MusicBeeAPI.Reducer, MusicBeeAPI.InitialState);

    const { current: API } = useRef(new MusicBeeAPI(dispatch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => API.initialize(), []);

    const classes = useStyles();

    const [customContext, setCustomContext] = useState("");
    const [customData, setCustomData] = useState("");

    return (
        <Paper elevation={5} className={classes.container}>
            <NowPlaying mbState={state} setState={dispatch} API={API} classes={classes} />
            <div>
                Custom:
                <input onChange={(e) => setCustomContext(e.target.value)} value={customContext} />
                <input onChange={(e) => setCustomData(e.target.value)} value={customData} />
                <button onClick={() => API.sendMessage(customContext, JSON.parse(customData))}>Send</button>
            </div>
        </Paper>
    );
};

export default Controller;
