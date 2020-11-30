import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";
import NowPlayingList from "./NowPlayingList";
import PlayerControls from "./PlayerControls";
import Playlists from "./Playlists";

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100vw",
        height: "100vh",
        display: "grid",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        gridTemplateColumns: "400px auto",
        gridTemplateRows: "auto 100px",
    },
}));

const Controller: React.FC<{}> = () => {
    const [loaded, setLoaded] = useState(false);

    const { current: API } = useRef(new MusicBeeAPI(() => setLoaded(true)));

    useEffect(() => API.initialize(), [API]);

    const classes = useStyles();

    const [customContext, setCustomContext] = useState("");
    const [customData, setCustomData] = useState("");

    return (
        <div className={classes.container}>
            {loaded ? (
                <>
                    <NowPlayingList API={API} />
                    <div style={{ gridColumn: "2 3", gridRow: "1 2" }}>
                        <Playlists API={API} />
                        Custom:
                        <input onChange={(e) => setCustomContext(e.target.value)} value={customContext} />
                        <input onChange={(e) => setCustomData(e.target.value)} value={customData} />
                        <button onClick={() => API.sendMessage(customContext, JSON.parse(customData))}>Send</button>
                    </div>
                    <PlayerControls API={API} />
                </>
            ) : (
                "Loading..."
            )}
        </div>
    );
};

export default Controller;
