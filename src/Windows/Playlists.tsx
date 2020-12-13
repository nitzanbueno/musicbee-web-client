import { IconButton, makeStyles, Typography } from "@material-ui/core";
import { ArrowBack, PlaylistPlay } from "@material-ui/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SongContainerList from "../Components/SongContainerList";
import SongList from "../Components/SongList";
import { MusicBeeAPIContext, Playlist, Track } from "../Logic/MusicBeeAPI";

const useStyles = makeStyles({
    playlistList: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    row: {
        display: "flex",
        alignItems: "center",
        height: 50,
    },
    songList: {
        flexGrow: 1,
        width: "100%",
        textAlign: "center",
    },
});

function doesPlaylistMatchSearchText(playlist: Playlist, searchText?: string) {
    if (!searchText) return true;

    return playlist.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
}

const Playlists: React.FC<{ searchText?: string }> = props => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const API = useContext(MusicBeeAPIContext);

    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[] | null>(null);

    const classes = useStyles();

    useEffect(() => {
        API.browsePlaylistsAsync().then(setPlaylists);
    }, [API, setPlaylists]);

    function handleOpen(playlist: Playlist) {
        API.getPlaylistTracksAsync(playlist.url).then(setSelectedPlaylistTracks);
    }

    function handleClose() {
        setSelectedPlaylistTracks(null);
    }

    async function handlePlaylistSongPlay(playlist: Playlist, index: number) {
        await API.playPlaylistAsync(playlist.url);
        API.playFromNowPlayingList(index + 1);
    }

    const filteredPlaylists = useMemo(() => playlists.filter(pl => doesPlaylistMatchSearchText(pl, props.searchText)), [
        props.searchText,
        playlists,
    ]);

    return (
        <SongContainerList
            items={filteredPlaylists}
            icon={PlaylistPlay}
            getTitle={pl => pl.name}
            onDoubleClick={pl => API.playPlaylist(pl.url)}
            onIconClick={pl => API.playPlaylist(pl.url)}
            onOpen={handleOpen}
            onClose={handleClose}
        >
            {({ item: pl, close }) => (
                <div className={classes.playlistList}>
                    <div className={classes.row}>
                        <IconButton onClick={close}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h5">{pl.name}</Typography>
                        <IconButton onClick={() => API.playPlaylist(pl.url)}>
                            <PlaylistPlay fontSize="large" />
                        </IconButton>
                    </div>
                    <div className={classes.songList}>
                        {selectedPlaylistTracks ? (
                            <SongList
                                onTogglePlayPause={API.playPause}
                                onPlay={(_, index) => handlePlaylistSongPlay(pl, index)}
                                songs={selectedPlaylistTracks}
                            />
                        ) : (
                            "Loading..."
                        )}
                    </div>
                </div>
            )}
        </SongContainerList>
    );
};

export default Playlists;
