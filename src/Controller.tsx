import { IconButton, makeStyles, Paper, Slider } from "@material-ui/core";
import Pause from "@material-ui/icons/Pause";
import PlayArrow from "@material-ui/icons/PlayArrow";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";

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

function millisToTime(millis: number) {
    const totalSeconds = Math.floor(millis / 1000);

    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;

    const hours = Math.floor(totalMinutes / 60);

    const secString = seconds === 0 ? "00" : (seconds < 10 ? "0" : "") + seconds;

    const minString = minutes === 0 ? "00" : (minutes < 10 ? "0" : "") + minutes;
    const hourString = hours > 0 ? hours + ":" : "";

    return hourString + minString + ":" + secString;
}

const Controller: React.FC<{}> = (props) => {
    const [state, dispatch] = useReducer(MusicBeeAPI.Reducer, MusicBeeAPI.InitialState);

    const { current: API } = useRef(new MusicBeeAPI(dispatch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => API.initialize(), []);

    const classes = useStyles();

    const [customContext, setCustomContext] = useState("");
    const [customData, setCustomData] = useState("");

    return (
        <Paper elevation={5} className={classes.container}>
            <h4>Now Playing:</h4>
            <h2>{state.nowPlayingTrack.title}</h2>
            <h3>{state.nowPlayingTrack.artist}</h3>
            <h3>
                {state.nowPlayingTrack.album} ({state.nowPlayingTrack.year})
            </h3>
            <IconButton onClick={() => API.playPause()} color="primary">
                {state.playerStatus.playerState === "Paused" ? <PlayArrow /> : <Pause />}
            </IconButton>
            <div className={classes.playbarContainer}>
                {millisToTime(state.trackTime)}
                <Slider
                    onChange={(_, value) => dispatch({ trackTime: value as number })}
                    onChangeCommitted={(_, value) => API.seek(value as number)}
                    className={classes.playbar}
                    value={state.trackTime}
                    max={state.trackLength}
                />
                {millisToTime(state.trackLength)}
            </div>
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
