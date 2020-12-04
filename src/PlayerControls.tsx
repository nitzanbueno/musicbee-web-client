import { IconButton, makeStyles, Slider } from "@material-ui/core";
import { PlayArrow, Pause, VolumeUp, SkipPrevious, SkipNext } from "@material-ui/icons";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { MusicBeeInfoContext } from "./MusicBeeInfo";
import { MusicBeeAPIContext } from "./MusicBeeAPI";
import { millisecondsToTime, useObjectReducer } from "./Utils";

const useStyles = makeStyles(theme => ({
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

const PlayerControls: React.FC<{}> = () => {
    const classes = useStyles();

    const API = useContext(MusicBeeAPIContext);
    const { nowPlayingTrack, playerStatus, trackTime: serverTrackTime } = useContext(MusicBeeInfoContext);

    const [localTrackTime, setLocalTrackTime] = useObjectReducer({ current: 0, total: 0 });
    const [localVolume, setLocalVolume] = useState(0);

    useEffect(() => console.log(nowPlayingTrack), [nowPlayingTrack]);

    // Synchronize the local track time/volume whenever the host sends new info
    // (This is so the user can seek smoothly without sending new API calls every millisecond)
    useEffect(() => setLocalTrackTime({ ...serverTrackTime }), [serverTrackTime, setLocalTrackTime]);
    useEffect(() => setLocalVolume(parseInt(playerStatus.playerVolume)), [playerStatus.playerVolume, setLocalVolume]);

    // Advance the seek bar every second
    useEffect(() => {
        // Set the track time to change every second
        // (approximately - this gets reset every once in a while when the server synchronizes the time)
        const interval = setInterval(() => {
            if (playerStatus.playerState === "Playing") {
                setLocalTrackTime(prev => ({ current: Math.min(prev.current + 1000, prev.total) }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [setLocalTrackTime, playerStatus.playerState]);

    return (
        <div className={classes.bar}>
            <div className={classes.metadata}>
                {nowPlayingTrack ? (
                    <>
                        <b>{nowPlayingTrack.title}</b>
                        <span>{nowPlayingTrack.artist}</span>
                        <span>
                            {nowPlayingTrack.album} ({nowPlayingTrack.year})
                        </span>
                    </>
                ) : (
                    "(not playing)"
                )}
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
                {millisecondsToTime(localTrackTime.current)}
                <Slider
                    onChange={(_, value) => setLocalTrackTime({ current: value as number })}
                    onChangeCommitted={(_, value) => API.seek(value as number)}
                    className={classes.seek}
                    value={localTrackTime.current}
                    max={localTrackTime.total}
                />
                {millisecondsToTime(localTrackTime.total)}
            </div>
            <div className={classes.volumeContainer}>
                <VolumeUp />
                <Slider
                    className={classes.volumeSlider}
                    value={localVolume}
                    max={100}
                    onChange={(_, value) => setLocalVolume(value as number)}
                    onChangeCommitted={(_, value) => API.setVolume(value as number)}
                />
                {playerStatus.playerVolume}
            </div>
        </div>
    );
};

export default PlayerControls;
