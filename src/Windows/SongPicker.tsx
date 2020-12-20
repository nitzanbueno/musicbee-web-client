import React, { useContext, useMemo } from "react";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";
import SongListWithContextMenu from "../Components/SongListWithContextMenu";

function doesTrackMatchQuery(track: Track, query?: string) {
    if (!query) return true;

    const searchFields = [track.title, track.artist, track.album, track.album_artist];

    for (const word of query.trim().toLocaleLowerCase().split(" ")) {
        if (searchFields.every(field => !field || !field.toLocaleLowerCase().includes(word))) {
            return false;
        }
    }

    return true;
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
