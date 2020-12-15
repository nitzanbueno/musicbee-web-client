import React, { useContext, useMemo } from "react";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";
import SongListWithContextMenu from "../Components/SongListWithContextMenu";

const TRACK_FIELDS_TO_SEARCH = ["album", "album_artist", "artist", "title"];

function doesTrackMatchQuery(track: Track, query?: string) {
    if (!query) return true;

    for (const fieldToSearch of TRACK_FIELDS_TO_SEARCH) {
        if (track[fieldToSearch]?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase())) return true;
    }

    return false;
}

const SongPicker: React.FC<{ searchText?: string }> = props => {
    const API = useContext(MusicBeeAPIContext);
    const { allTracks } = useContext(MusicBeeInfoContext);

    const filteredTracks = useMemo(
        () => (allTracks ? allTracks.filter(track => doesTrackMatchQuery(track, props.searchText)) : []),
        [allTracks, props.searchText]
    );

    return <SongListWithContextMenu songs={filteredTracks} onPlay={API.playTrackNowAsync} />;
};

export default SongPicker;
