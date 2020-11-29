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

interface NowPlayingSong {
    Artist: string;
    Path: string;
    Position: number;
    Title: string;
}

const NowPlayingList: React.FC<{ API: MusicBeeAPI }> = ({ API }) => {
    const [nowPlayingSongs, setNowPlayingSongs] = useState<NowPlayingSong[]>([]);

    function handleNowPlayingList(data: NowPlayingSong[]) {
        console.log(data);
        setNowPlayingSongs(data);
    }

    function refreshNowPlayingList() {
        API.sendMessage("nowplayinglist", "");
    }

    useEffect(() => {
        API.addEventListener("nowplayinglist", handleNowPlayingList);
        API.addEventListener("nowplayinglistchanged", refreshNowPlayingList);
        refreshNowPlayingList();
        return () => API.removeEventListener("nowplayinglist", handleNowPlayingList);
    }, [API]);

    return (
        <>
            Now Playing:
            <select multiple>
                {nowPlayingSongs.map(({ Title, Position }) => (
                    <option onDoubleClick={() => API.sendMessage("nowplayinglistplay", Position)} key={Position}>
                        {Position}. {Title}
                    </option>
                ))}
            </select>
        </>
    );
};

export default NowPlayingList;
