import { IconButton, makeStyles, Slider } from "@material-ui/core";
import {
    PlayArrow,
    Pause,
    VolumeUp,
    SkipPrevious,
    SkipNext,
    Shuffle,
    Headset,
    Repeat,
    RepeatOne,
} from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";
import { MusicBeeAPIContext } from "../Logic/MusicBeeAPI";
import { millisecondsToTime, useObjectReducer } from "../Logic/Utils";
import OverflowScroller from "./OverflowScroller";

const useStyles = makeStyles(theme => ({
    bar: {
        gridColumn: "1 / -1",
        gridRow: "2 / 3",
        height: "100%",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.grey[300],
    },
    seek: {
        margin: "0px 10px",
        color: theme.palette.primary.main,
    },
    volumeSlider: {
        width: 200,
        marginRight: 10,
        marginLeft: 10,
        color: theme.palette.primary.main,
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        marginLeft: 20,
    },
    seekContainer: {
        display: "flex",
        alignItems: "center",
        width: "60%",
        justifyContent: "start",
        marginLeft: 20,
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        width: 200,
        overflow: "hidden",
        position: "relative",
    },
    controlButtonGroup: {
        display: "flex",
        alignItems: "center",
    },
    controlButton: {
        color: theme.palette.primary.main,
        margin: "0 -5px",
    },
    onButton: {
        color: theme.palette.primary.main,
    },
    offButton: {
        color: theme.palette.common.white,
    },
}));

const PlayerControls: React.FC<{}> = () => {
    const classes = useStyles();

    const API = useContext(MusicBeeAPIContext);
    const {
        nowPlayingTrack,
        playerStatus: { playerShuffle, playerVolume, playerState, playerRepeat },
        trackTime: serverTrackTime,
    } = useContext(MusicBeeInfoContext);

    const [localTrackTime, setLocalTrackTime] = useObjectReducer({ current: 0, total: 0 });
    const [localVolume, setLocalVolume] = useState(0);

    // Synchronize the local track time/volume whenever the host sends new info
    // (This is so the user can seek smoothly without sending new API calls every millisecond)
    useEffect(() => setLocalTrackTime({ ...serverTrackTime }), [serverTrackTime, setLocalTrackTime]);
    useEffect(() => setLocalVolume(parseInt(playerVolume)), [playerVolume, setLocalVolume]);

    // Advance the seek bar every second
    useEffect(() => {
        // Set the track time to change every second
        // (approximately - this gets reset every once in a while when the server synchronizes the time)
        const interval = setInterval(() => {
            if (playerState === "playing") {
                setLocalTrackTime(prev => ({ current: Math.min(prev.current + 1000, prev.total) }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [setLocalTrackTime, playerState]);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Don't trigger events if the user is on an input field
            // @ts-ignore
            if (e.target?.matches('input[type="text"]')) {
                return;
            }

            if (e.key === " ") {
                API?.playPause();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [API]);

    return (
        <div className={classes.bar}>
            <div className={classes.metadata}>
                {nowPlayingTrack ? (
                    <>
                        <OverflowScroller>
                            <b>{nowPlayingTrack.title}</b>
                        </OverflowScroller>
                        <OverflowScroller>
                            <span>{nowPlayingTrack.artist}</span>
                        </OverflowScroller>
                        <OverflowScroller>
                            <span>
                                <i>{nowPlayingTrack.album}</i>
                                {nowPlayingTrack.year ? ` (${nowPlayingTrack.year})` : ""}
                            </span>
                        </OverflowScroller>
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
                    {playerState !== "playing" ? <PlayArrow /> : <Pause />}
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
            <div className={classes.buttonGroup}>
                <IconButton
                    className={playerShuffle === "off" ? classes.offButton : classes.onButton}
                    onClick={() => API.toggleShuffle()}
                >
                    {playerShuffle === "autodj" ? <Headset /> : <Shuffle />}
                </IconButton>
                <IconButton
                    className={playerRepeat === "none" ? classes.offButton : classes.onButton}
                    onClick={() => API.toggleRepeat()}
                >
                    {playerRepeat === "one" ? <RepeatOne /> : <Repeat />}
                </IconButton>
            </div>
            <div className={classes.buttonGroup}>
                <VolumeUp />
                <Slider
                    className={classes.volumeSlider}
                    value={localVolume}
                    max={100}
                    onChange={(_, value) => setLocalVolume(value as number)}
                    onChangeCommitted={(_, value) => API.setVolume(value as number)}
                />
                <span style={{ width: "1.3em" }}>{localVolume}</span>
            </div>
        </div>
    );
};

export default PlayerControls;
