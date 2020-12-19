import { IconButton, makeStyles, Typography } from "@material-ui/core";
import { Album as AlbumIcon, ArrowBack, PlayArrow } from "@material-ui/icons";
import React, { useContext, useMemo, useState } from "react";
import SongContainerList from "../Components/SongContainerList";
import SongListWithContextMenu from "../Components/SongListWithContextMenu";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";

const useStyles = makeStyles({
    albumListing: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    row: {
        display: "flex",
        alignItems: "center",
        height: 80,
    },
    songList: {
        flexGrow: 1,
        width: "100%",
        textAlign: "center",
    },
    albumHeader: {
        display: "flex",
        flexDirection: "column",
        margin: "0 11px",
    },
});

interface Album {
    title: string;
    artist: string;
    tracks: Track[];
}

function doesAlbumMatchSearchText(album: Album, searchText?: string) {
    if (!searchText) return true;

    return ["title", "artist"].some(key => album[key]?.toLocaleLowerCase()?.includes(searchText.toLocaleLowerCase()));
}

function createAlbumsFromTracks(tracks: Track[]): Album[] {
    const albumMap = new Map<string, Album>();

    for (const track of tracks) {
        const artistKey = track.artist?.toLocaleLowerCase().trim() ?? "Unknown Artist";
        const titleKey = track.album?.toLocaleLowerCase().trim() ?? "Unknown Album";
        const mapKey = JSON.stringify([artistKey, titleKey]);

        const album = albumMap.get(mapKey);

        if (!album) {
            albumMap.set(mapKey, { artist: track.artist, title: track.album, tracks: [track] });
            continue;
        }

        album.tracks.push(track);
    }

    return Array.from(albumMap.values(), album => {
        // Sort the album tracks before returning!
        album.tracks.sort((a, b) => a.trackno - b.trackno);
        return album;
    });
}

const Albums: React.FC<{ searchText?: string }> = props => {
    const API = useContext(MusicBeeAPIContext);
    const info = useContext(MusicBeeInfoContext);

    const [selectedAlbumTracks, setSelectedAlbumTracks] = useState<Track[] | null>(null);

    const classes = useStyles();

    function handleOpen(album: Album) {
        setSelectedAlbumTracks(album.tracks);
    }

    function handleClose() {
        setSelectedAlbumTracks(null);
    }

    function playAlbum(album: Album) {
        return API.queueTracksAsync("now", ...album.tracks);
    }

    async function handleAlbumSongPlay(album: Album, index: number) {
        await playAlbum(album);
        API.playFromNowPlayingList(index + 1);
    }

    const albums = useMemo(() => createAlbumsFromTracks(info.allTracks), [info.allTracks]);

    const filteredAlbums = useMemo(() => albums.filter(a => doesAlbumMatchSearchText(a, props.searchText)), [
        props.searchText,
        albums,
    ]);

    return (
        <SongContainerList
            items={filteredAlbums}
            icon={AlbumIcon}
            getTitle={a => a.title ?? <i>Unknown Album</i>}
            getSubtitle={a => a.artist ?? <i>Unknown Artist</i>}
            onDoubleClick={playAlbum}
            onIconClick={playAlbum}
            onOpen={handleOpen}
            onClose={handleClose}
        >
            {({ item: album, close }) => (
                <div className={classes.albumListing}>
                    <div className={classes.row}>
                        <IconButton onClick={close}>
                            <ArrowBack />
                        </IconButton>
                        <div className={classes.albumHeader}>
                            <Typography variant="h5">{album.title ?? <i>Unknown Album</i>}</Typography>
                            <Typography variant="subtitle1">{album.artist ?? <i>Unknown Artist</i>}</Typography>
                        </div>
                        <IconButton onClick={() => playAlbum(album)}>
                            <PlayArrow fontSize="large" />
                        </IconButton>
                    </div>
                    <div className={classes.songList}>
                        {selectedAlbumTracks ? (
                            <SongListWithContextMenu
                                onPlay={(_, index) => handleAlbumSongPlay(album, index)}
                                songs={selectedAlbumTracks}
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

export default Albums;
