import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { MusicBeeAPI } from "./MusicBeeAPI";

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
            <select multiple>
                {playlistNames.map(({ name, url }) => (
                    <option onDoubleClick={() => API.sendMessage("playlistplay", url)} key={name}>
                        {name}
                    </option>
                ))}
            </select>
        </>
    );
};

export default Playlists;