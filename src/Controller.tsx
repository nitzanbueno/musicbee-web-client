import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";
import NowPlaying from "./NowPlaying";
import Playlists from "./Playlists";

const useStyles = makeStyles({
    container: {
        width: "80%",
        height: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
});

const Controller: React.FC<{}> = () => {
    const [loaded, setLoaded] = useState(false);

    const { current: API } = useRef(new MusicBeeAPI(() => setLoaded(true)));

    useEffect(() => API.initialize(), [API]);

    const classes = useStyles();

    const [customContext, setCustomContext] = useState("");
    const [customData, setCustomData] = useState("");

    return (
        <Paper elevation={5} className={classes.container}>
            {loaded ? (
                <>
                    <NowPlaying API={API} />
                    <Playlists API={API} />
                    <div>
                        Custom:
                        <input onChange={(e) => setCustomContext(e.target.value)} value={customContext} />
                        <input onChange={(e) => setCustomData(e.target.value)} value={customData} />
                        <button onClick={() => API.sendMessage(customContext, JSON.parse(customData))}>Send</button>
                    </div>
                </>
            ) : (
                "Loading..."
            )}
        </Paper>
    );
};

export default Controller;
