import { IconButton, makeStyles, Slider } from "@material-ui/core";
import { PlayArrow, Pause, VolumeUp, SkipPrevious, SkipNext } from "@material-ui/icons";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";

const useStyles = makeStyles((theme) => ({
    bar: {
        gridColumn: "1 / -1",
        gridRow: "2 / 3",
        height: "100%",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.grey[300],
    },
    seek: {
        margin: "0px 5px",
        color: theme.palette.primary.light,
    },
    volumeSlider: {
        width: 200,
        marginRight: 10,
        marginLeft: 10,
        color: theme.palette.primary.light,
    },
    volumeContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: 30,
    },
    seekContainer: {
        display: "flex",
        alignItems: "center",
        width: "60%",
        justifyContent: "start",
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
    },
    controlButtonGroup: {
        display: "flex",
        alignItems: "center",
    },
    controlButton: {
        color: theme.palette.primary.light,
    },
}));

function millisecondsToTime(millis: number) {
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

type PartialSetStateAction<T> = Partial<T> | ((prev: T) => Partial<T>);

function useObjectReducer<T>(initialState: T) {
    return useReducer<React.Reducer<T, PartialSetStateAction<T>>>((prevState: T, newPartialState: PartialSetStateAction<T>) => {
        if (typeof newPartialState === "function") {
            return { ...prevState, ...newPartialState(prevState) };
        } else {
            return { ...prevState, ...newPartialState };
        }
    }, initialState);
}

const PlayerControls: React.FC<{}> = () => {
    const classes = useStyles();
    const [serverTrackTime, setServerTrackTime] = useState({ current: 0, total: 0 });
    const [trackTime, setTrackTime] = useObjectReducer({ current: 0, total: 0 });
    const [nowPlayingTrack, setNowPlayingTrack] = useState({ title: "", artist: "", album: "", year: "" });
    const [playerStatus, setPlayerStatus] = useObjectReducer({
        playerMute: false,
        playerRepeat: "",
        playerShuffle: false,
        playerState: "",
        playerVolume: "",
    });
    const API = useContext(MusicBeeAPIContext);

    useEffect(() => {
        const playerStateCallback = (playerState) => setPlayerStatus({ playerState });

        const playerStatusCallback = ({ playerstate, playerrepeat, playershuffle, playermute, playervolume }) => {
            setPlayerStatus({
                playerState: playerstate,
                playerMute: playermute,
                playerRepeat: playerrepeat,
                playerShuffle: playershuffle,
                playerVolume: playervolume,
            });
        };

        const playerVolumeCallback = (playerVolume) => setPlayerStatus({ playerVolume });

        API.addEventListener("nowplayingposition", setServerTrackTime);
        API.addEventListener("nowplayingtrack", setNowPlayingTrack);
        API.addEventListener("playerstate", playerStateCallback);
        API.addEventListener("playervolume", playerVolumeCallback);
        API.addEventListener("playerstatus", playerStatusCallback);

        return () => {
            API.removeEventListener("nowplayingposition", setTrackTime);
            API.removeEventListener("nowplayingtrack", setNowPlayingTrack);
            API.removeEventListener("playerstate", playerStateCallback);
            API.removeEventListener("playervolume", playerVolumeCallback);
            API.removeEventListener("playerstatus", playerStatusCallback);
        };
    }, [API, setTrackTime, setNowPlayingTrack, setPlayerStatus]);

    useEffect(() => {
        API.sendMessage("init", "");
        API.sendMessage("playerstatus", "");
        API.sendMessage("nowplayingposition", true);
    }, [API]);

    useEffect(() => {
        // Set the track time to change every second
        // (approximately - this gets reset every once in a while when the server synchronizes the time)
        const interval = setInterval(() => {
            if (playerStatus.playerState === "Playing") {
                setTrackTime((prev) => ({ current: Math.min(prev.current + 1000, prev.total) }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [setTrackTime, playerStatus.playerState]);

    useEffect(() => setTrackTime({ ...serverTrackTime }), [serverTrackTime, setTrackTime]);

    return (
        <div className={classes.bar}>
            <div className={classes.metadata}>
                <b>{nowPlayingTrack.title}</b>
                <span>{nowPlayingTrack.artist}</span>
                <span>
                    {nowPlayingTrack.album} ({nowPlayingTrack.year})
                </span>
            </div>
            <div className={classes.controlButtonGroup}>
                <IconButton onClick={() => API.skipPrevious()} className={classes.controlButton}>
                    <SkipPrevious />
                </IconButton>
                <IconButton onClick={() => API.playPause()} className={classes.controlButton}>
                    {playerStatus.playerState === "Paused" ? <PlayArrow /> : <Pause />}
                </IconButton>
                <IconButton onClick={() => API.skipNext()} className={classes.controlButton}>
                    <SkipNext />
                </IconButton>
            </div>

            <div className={classes.seekContainer}>
                {millisecondsToTime(trackTime.current)}
                <Slider
                    onChange={(_, value) => setTrackTime({ current: value as number })}
                    onChangeCommitted={(_, value) => API.seek(value as number)}
                    className={classes.seek}
                    value={trackTime.current}
                    max={trackTime.total}
                />
                {millisecondsToTime(trackTime.total)}
            </div>
            <div className={classes.volumeContainer}>
                <VolumeUp />
                <Slider
                    className={classes.volumeSlider}
                    value={parseInt(playerStatus.playerVolume)}
                    max={100}
                    onChange={(_, value) => setPlayerStatus({ playerVolume: value.toString() })}
                    onChangeCommitted={(_, value) => API.setVolume(value as number)}
                />
                {playerStatus.playerVolume}
            </div>
        </div>
    );
};

export default PlayerControls;
