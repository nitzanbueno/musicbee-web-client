import { makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import MainWindow from "./MainWindow";
import { MusicBeeAPI, MusicBeeAPIContext } from "../Logic/MusicBeeAPI";
import NowPlayingList from "./NowPlayingList";
import PlayerControls from "../Components/PlayerControls";
import { MusicBeeInfoProvider } from "../Logic/MusicBeeInfo";
import ConnectForm from "./ConnectForm";
import ErrorText from "../Components/ErrorText";

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
    const [error, setError] = useState(false);

    const [API, setAPI] = useState<MusicBeeAPI | null>(null);

    function handleLoad(newAPI: MusicBeeAPI) {
        setAPI(newAPI);
        setError(false);
    }

    useEffect(() => {
        if (!API) return;

        function handleError() {
            setError(!API?.didRequestDisconnect);
            setAPI(null);
        }

        API.addErrorListener(handleError);
        return () => API.removeErrorListener(handleError);
    }, [API, setError]);

    const classes = useStyles();

    return (
        <div className={classes.body}>
            {API ? (
                <MusicBeeAPIContext.Provider value={API}>
                    <MusicBeeInfoProvider>
                        <div className={classes.container}>
                            <NowPlayingList />
                            <MainWindow />
                            <PlayerControls />
                        </div>
                    </MusicBeeInfoProvider>
                </MusicBeeAPIContext.Provider>
            ) : (
                <>
                    <ConnectForm error={error} onConnect={handleLoad} />
                </>
            )}
        </div>
    );
};

export default Controller;
