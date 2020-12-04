import { makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import MainWindow from "./MainWindow";
import { MusicBeeAPI, MusicBeeAPIContext } from "./MusicBeeAPI";
import NowPlayingList from "./NowPlayingList";
import PlayerControls from "./PlayerControls";
import { MusicBeeInfoProvider } from "./MusicBeeInfo";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100vw",
        height: "100vh",
        display: "grid",
        flexDirection: "column",
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

    return (
        <MusicBeeAPIContext.Provider value={API}>
            <div className={classes.container}>
                {loaded ? (
                    <MusicBeeInfoProvider>
                        <NowPlayingList />
                        <MainWindow />
                        <PlayerControls />
                    </MusicBeeInfoProvider>
                ) : (
                    "Loading..."
                )}
            </div>
        </MusicBeeAPIContext.Provider>
    );
};

export default Controller;
