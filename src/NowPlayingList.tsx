import { makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";
import SongList from "./SongList";

const useStyles = makeStyles(theme => ({
    container: {
        left: 0,
        width: 400,
        backgroundColor: theme.palette.grey[600],
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColumnStart: 1,
        gridColumnEnd: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    songList: {
        flexGrow: 1,
        width: "100%",
    },
    title: {
        marginBottom: 10,
        marginTop: 10,
    },
}));

interface NowPlayingSong {
    Artist: string;
    Path: string;
    Position: number;
    Title: string;
}

const NowPlayingList: React.FC<{}> = () => {
    const API = useContext(MusicBeeAPIContext);
    const [nowPlayingSongs, setNowPlayingSongs] = useState<NowPlayingSong[]>([]);
    const classes = useStyles();

    function handleNowPlayingList(data: NowPlayingSong[]) {
        setNowPlayingSongs(data);
    }

    function refreshNowPlayingList() {
        API.sendMessage("nowplayinglist", "");
    }

    useEffect(() => {
        API.addEventListener("nowplayinglist", handleNowPlayingList);
        API.addEventListener("nowplayinglistchanged", refreshNowPlayingList);
        refreshNowPlayingList();
        return () => API.removeEventListener("nowplayinglist", handleNowPlayingList);
    }, [API]);

    return (
        <div className={classes.container}>
            <Typography variant="h4" className={classes.title}>
                Now Playing
            </Typography>
            <SongList
                songHeight={60}
                className={classes.songList}
                songs={nowPlayingSongs}
                pathKey="Path"
                titleKey="Title"
                artistKey="Artist"
                onSet={index => API.sendMessage("nowplayinglistplay", nowPlayingSongs[index].Position)}
                onTogglePlayPause={API.playPause}
            />
        </div>
    );
};

export default NowPlayingList;
