import { IconButton, makeStyles, Slider } from "@material-ui/core";
import { PlayArrow, Pause } from "@material-ui/icons";
import React, { useEffect, useReducer, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";

const useStyles = makeStyles({
    seek: {
        margin: "0px 5px",
    },
    volumeSlider: {
        width: 200,
        marginRight: 10,
    },
    seekAndVolumeContainer: {
        display: "flex",
        alignItems: "center",
        width: "80%",
        justifyContent: "space-between",
    },
    volumeContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: 30,
    },
    seekContainer: {
        display: "flex",
        alignItems: "center",
        width: "80%",
        justifyContent: "start",
    },
});

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

function useObjectReducer<T>(initialState: T) {
    return useReducer<React.Reducer<T, Partial<T>>>(
        (prevState: T, newPartialState: Partial<T>) => ({ ...prevState, ...newPartialState }),
        initialState
    );
}

const NowPlaying: React.FC<{ API: MusicBeeAPI }> = ({ API }) => {
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
        setTrackTime({ ...serverTrackTime });

        let extraTime = 0;

        // Set the track time to change every second
        const interval = setInterval(() => {
            if (playerStatus.playerState === "Playing") {
                extraTime += 1000;
                setTrackTime({ current: Math.min(serverTrackTime.current + extraTime, serverTrackTime.total) });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [serverTrackTime, setTrackTime, playerStatus.playerState]);

    return (
        <>
            <h4>Now Playing:</h4>
            <h2>{nowPlayingTrack.title}</h2>
            <h3>{nowPlayingTrack.artist}</h3>
            <h3>
                {nowPlayingTrack.album} ({nowPlayingTrack.year})
            </h3>
            <IconButton onClick={() => API.playPause()} color="primary">
                {playerStatus.playerState === "Paused" ? <PlayArrow /> : <Pause />}
            </IconButton>
            <div className={classes.seekAndVolumeContainer}>
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
        </>
    );
};

export default NowPlaying;
