import { List, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import { PlaylistPlay } from "@material-ui/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";

const useStyles = makeStyles({
    playlistList: {
        width: "100%",
    },
    playlistItem: {
        cursor: "pointer",
    },
});

interface Playlist {
    name: string;
    url: string;
}

function doesPlaylistMatchSearchText(playlist: Playlist, searchText?: string) {
    if (!searchText) return true;

    return playlist.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
}

const Playlists: React.FC<{ searchText?: string }> = props => {
    const [playlists, setPlaylists] = useState([]);
    const API = useContext(MusicBeeAPIContext);

    const classes = useStyles();

    useEffect(() => {
        API.addEventListener("playlistlist", setPlaylists);
        API.sendMessage("playlistlist");
        return () => API.removeEventListener("playlistlist", setPlaylists);
    }, [API, setPlaylists]);

    const filteredPlaylists = useMemo(() => playlists.filter(l => doesPlaylistMatchSearchText(l, props.searchText)), [
        props.searchText,
        playlists,
    ]);

    return (
        <List className={classes.playlistList}>
            {filteredPlaylists.map(({ name, url }) => (
                <ListItem
                    onDoubleClick={() => API.sendMessage("playlistplay", url)}
                    key={name}
                    className={classes.playlistItem}
                >
                    <ListItemIcon>
                        <PlaylistPlay />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                </ListItem>
            ))}
        </List>
    );
};

export default Playlists;
