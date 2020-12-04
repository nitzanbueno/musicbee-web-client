import React, { useContext, useEffect, useMemo, useReducer } from "react";
import { makeStyles } from "@material-ui/core";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";
import SongList from "../Components/SongList";

const TRACK_FIELDS_TO_SEARCH = ["album", "album_artist", "artist", "title"];

function doesTrackMatchQuery(track: Track, query?: string) {
    if (!query) return true;

    for (const fieldToSearch of TRACK_FIELDS_TO_SEARCH) {
        if (track[fieldToSearch].toLocaleLowerCase().includes(query.toLocaleLowerCase())) return true;
    }

    return false;
}

const SongPicker: React.FC<{ searchText?: string }> = props => {
    const forceUpdate = useReducer(x => !x, true)[1];

    const API = useContext(MusicBeeAPIContext);

    useEffect(() => {
        // Reload on update
        API.addEventListener("browsetracks", forceUpdate);

        if (!API.allTracks) {
            API.browseTracks();
        }
    }, [API]);

    const filteredTracks = useMemo(() => API.allTracks?.filter(track => doesTrackMatchQuery(track, props.searchText)), [
        API.allTracks,
        props.searchText,
    ]);

    return filteredTracks ? (
        <SongList
            songHeight={60}
            songs={filteredTracks}
            artistKey="artist"
            titleKey="title"
            pathKey="src"
            onSet={index => API.playTrackNow(filteredTracks[index])}
            onTogglePlayPause={API.playPause}
        />
    ) : null;
};

export default SongPicker;
