import React, { useContext, useMemo, useState } from "react";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";
import SongList from "../Components/SongList";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";

const TRACK_FIELDS_TO_SEARCH = ["album", "album_artist", "artist", "title"];

function doesTrackMatchQuery(track: Track, query?: string) {
    if (!query) return true;

    for (const fieldToSearch of TRACK_FIELDS_TO_SEARCH) {
        if (track[fieldToSearch]?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase())) return true;
    }

    return false;
}

const SongMenu: React.FC<{
    queueNext: () => void;
    queueAlbum: () => void;
    queueLast: () => void;
    queueNextAndPlay: () => void;
}> = props => {
    const [anchorEl, setAnchorEl] = useState<any>(null);

    function handleClose() {
        setAnchorEl(null);
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        setAnchorEl(e.currentTarget);
    }

    function closeAndRun(f: Function) {
        return () => {
            handleClose();
            f();
        };
    }

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                <MenuItem onClick={closeAndRun(props.queueNext)}>Queue Next</MenuItem>
                <MenuItem onClick={closeAndRun(props.queueLast)}>Queue Last</MenuItem>
            </Menu>
        </>
    );
};

const SongPicker: React.FC<{ searchText?: string }> = props => {
    const API = useContext(MusicBeeAPIContext);
    const { allTracks } = useContext(MusicBeeInfoContext);

    const filteredTracks = useMemo(
        () => (allTracks ? allTracks.filter(track => doesTrackMatchQuery(track, props.searchText)) : []),
        [allTracks, props.searchText]
    );

    function renderSecondaryAction(track: Track) {
        return (
            <SongMenu
                queueAlbum={() => {}}
                queueNext={() => API.queueTracks("next", track)}
                queueLast={() => API.queueTracks("last", track)}
                queueNextAndPlay={() => API.queueTracks("now", track)} // Doesn't actually queue next and play, shhhhh
            />
        );
    }

    return (
        <SongList
            songs={filteredTracks}
            artistKey="artist"
            titleKey="title"
            pathKey="src"
            onPlay={API.playTrackNow}
            onTogglePlayPause={API.playPause}
            renderSecondaryAction={renderSecondaryAction}
        />
    );
};

export default SongPicker;
