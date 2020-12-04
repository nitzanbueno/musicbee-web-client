import React, { useContext, useEffect, useReducer } from "react";
import { makeStyles } from "@material-ui/core";
import { MusicBeeAPIContext, Track } from "./MusicBeeAPI";
import { SongList } from "./SongList";

const useStyles = makeStyles(theme => ({
    songPicker: {
        width: "100%",
        height: "100%",
    },
}));

const SongPicker: React.FC<{}> = () => {
    const API = useContext(MusicBeeAPIContext);
    const forceUpdate = useReducer(x => !x, true)[1];
    const classes = useStyles();
    console.log(API.allTracks);

    useEffect(() => {
        // Reload on update
        API.addEventListener("browsetracks", forceUpdate);

        if (!API.allTracks) {
            API.browseTracks();
        }
    }, []);

    return API.allTracks !== undefined ? (
        <SongList
            songHeight={60}
            className={classes.songPicker}
            songs={API.allTracks}
            onPlay={index => API.playTrackNow((API.allTracks as Track[])[index])}
        />
    ) : null;
};

export default SongPicker;
