import { IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";

const useStyles = makeStyles((theme) => ({
    container: {
        left: 0,
        width: 400,
        backgroundColor: theme.palette.grey[600],
        gridRowStart: 1,
        gridRowEnd: 2,
        gridColumnStart: 1,
        gridColumnEnd: 2,
        maxHeight: "100%",
        overflowY: "scroll",
    },
}));

interface NowPlayingSong {
    Artist: string;
    Path: string;
    Position: number;
    Title: string;
}

const NowPlayingList: React.FC<{ API: MusicBeeAPI }> = ({ API }) => {
    const [nowPlayingSongs, setNowPlayingSongs] = useState<NowPlayingSong[]>([]);
    const classes = useStyles();

    function handleNowPlayingList(data: NowPlayingSong[]) {
        console.log(data);
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
            <Typography variant="body1">Now Playing</Typography>
            <List>
                {nowPlayingSongs.map(({ Title, Position, Artist }) => (
                    <ListItem key={Position}>
                        <ListItemIcon>
                            <IconButton onClick={() => API.sendMessage("nowplayinglistplay", Position)}>
                                <PlayArrow />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={`${Title}`} secondary={Artist} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default NowPlayingList;
