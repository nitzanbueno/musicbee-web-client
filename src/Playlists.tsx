import { IconButton, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import { PlaylistPlay } from "@material-ui/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";
import VirtualList from "./VirtualList";

const PLAYLIST_ITEM_HEIGHT = 60;

const useStyles = makeStyles({
    playlistList: {
        width: "100%",
        height: "100%",
    },
    playlistItem: {
        cursor: "pointer",
        height: PLAYLIST_ITEM_HEIGHT + "px",
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
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
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
        <VirtualList
            rowHeight={PLAYLIST_ITEM_HEIGHT}
            rowCount={filteredPlaylists.length}
            rowRenderer={({ index, style }) => {
                const playlist = filteredPlaylists[index];

                return (
                    <ListItem
                        onDoubleClick={() => API.playPlaylist(playlist.url)}
                        key={index}
                        className={classes.playlistItem}
                        style={style}
                    >
                        <ListItemIcon>
                            <IconButton onClick={() => API.playPlaylist(playlist.url)}>
                                <PlaylistPlay />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={playlist.name} />
                    </ListItem>
                );
            }}
        ></VirtualList>
    );
};

export default Playlists;
