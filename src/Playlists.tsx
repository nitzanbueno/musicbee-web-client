import { makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";

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

const Playlists: React.FC<{}> = () => {
    const [playlistNames, setPlaylistNames] = useState([]);
    const API = useContext(MusicBeeAPIContext);

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
                    <option onClick={() => console.log(url)} onDoubleClick={() => API.sendMessage("playlistplay", url)} key={name}>
                        {name}
                    </option>
                ))}
            </select>
        </>
    );
};

export default Playlists;
