import { IconButton, makeStyles, Slider } from "@material-ui/core";
import { PlayArrow, Pause } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { MusicBeeAPI, MusicBeeState, MusicBeeStateDispatch } from "./MusicBeeAPI";

const useStyles = makeStyles({
    seek: {
        margin: "0px 5px",
    },
    volumeSlider: {
        width: 200,
        marginRight: 10,
    },
    seekAndVolumeContainer: {
        display: "flex",
        alignItems: "center",
        width: "80%",
        justifyContent: "space-between",
    },
    volumeContainer: {
        display: "flex",
        alignItems: "center",
        marginLeft: 30,
    },
    seekContainer: {
        display: "flex",
        alignItems: "center",
        width: "80%",
        justifyContent: "start",
    },
});

const Playlists: React.FC<{ API: MusicBeeAPI }> = ({ API }) => {
    const [playlistNames, setPlaylistNames] = useState([]);

    function handlePlaylists({ data, offset, limit, total }: any) {
        setPlaylistNames(data);
    }

    useEffect(() => {
        API.addEventListener("playlistlist", handlePlaylists);
        API.sendMessage("playlistlist", { offset: 0, limit: 100 });
        return () => API.removeEventListener("playlistlist", handlePlaylists);
    }, []);

    return (
        <>
            Playlists:
            <button onClick={() => API.sendMessage("playlistlist", { offset: 0, limit: 100 })}>Try again?</button>
            <select multiple>
                {playlistNames.map(({ name }) => (
                    <option key={name}>{name}</option>
                ))}
            </select>
        </>
    );
};

export default Playlists;
