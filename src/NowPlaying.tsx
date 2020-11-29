import { IconButton, Slider } from "@material-ui/core";
import { PlayArrow, Pause } from "@material-ui/icons";
import React from "react";
import { MusicBeeAPI, MusicBeeState, MusicBeeStateDispatch } from "./MusicBeeAPI";

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

const NowPlaying: React.FC<{ mbState: MusicBeeState; API: MusicBeeAPI; setState: MusicBeeStateDispatch; classes: any }> = ({
    mbState,
    API,
    setState,
    classes,
}) => {
    return (
        <>
            <h4>Now Playing:</h4>
            <h2>{mbState.nowPlayingTrack.title}</h2>
            <h3>{mbState.nowPlayingTrack.artist}</h3>
            <h3>
                {mbState.nowPlayingTrack.album} ({mbState.nowPlayingTrack.year})
            </h3>
            <IconButton onClick={() => API.playPause()} color="primary">
                {mbState.playerStatus.playerState === "Paused" ? <PlayArrow /> : <Pause />}
            </IconButton>
            <div className={classes.playbarContainer}>
                {millisToTime(mbState.trackTime)}
                <Slider
                    onChange={(_, value) => setState({ trackTime: value as number })}
                    onChangeCommitted={(_, value) => API.seek(value as number)}
                    className={classes.playbar}
                    value={mbState.trackTime}
                    max={mbState.trackLength}
                />
                {millisToTime(mbState.trackLength)}
            </div>
        </>
    );
};

export default NowPlaying;
