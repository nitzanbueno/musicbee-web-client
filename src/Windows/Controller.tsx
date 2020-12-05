import { makeStyles } from "@material-ui/core";
import React, { useRef, useState } from "react";
import MainWindow from "./MainWindow";
import { MusicBeeAPI, MusicBeeAPIContext } from "../Logic/MusicBeeAPI";
import NowPlayingList from "./NowPlayingList";
import PlayerControls from "../Components/PlayerControls";
import { MusicBeeInfoProvider } from "../Logic/MusicBeeInfo";
import ConnectForm from "./ConnectForm";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        height: "100%",
        display: "grid",
        flexDirection: "column",
        position: "absolute",
        gridTemplateColumns: "400px auto",
        gridTemplateRows: "auto 100px",
    },
    body: {
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },
}));

const Controller: React.FC<{}> = () => {
    const [loaded, setLoaded] = useState(false);

    const { current: API } = useRef(new MusicBeeAPI());

    function handleLoad() {
        setLoaded(true);
    }

    const classes = useStyles();

    return (
        <div className={classes.body}>
            <MusicBeeAPIContext.Provider value={API}>
                {loaded ? (
                    <MusicBeeInfoProvider>
                        <div className={classes.container}>
                            <NowPlayingList />
                            <MainWindow />
                            <PlayerControls />
                        </div>
                    </MusicBeeInfoProvider>
                ) : (
                    <ConnectForm onLoad={handleLoad} />
                )}
            </MusicBeeAPIContext.Provider>
        </div>
    );
};

export default Controller;
