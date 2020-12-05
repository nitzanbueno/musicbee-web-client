import React, { useContext, useEffect, useState } from "react";
import { MusicBeeAPIContext } from "./MusicBeeAPI";
import { useObjectReducer } from "./Utils";

export interface NowPlayingTrack {
    album: string;
    artist: string;
    path: string;
    title: string;
    year: string;
}

export interface PlayerStatus {
    playerMute: boolean;
    playerRepeat: string;
    playerShuffle: string;
    playerState: "playing" | "paused" | "stopped" | "";
    playerVolume: string;
}

export interface MusicBeeInfo {
    nowPlayingTrack: NowPlayingTrack | null;
    trackTime: { current: number; total: number } | null;
    playerStatus: PlayerStatus;
}

const defaultContext: MusicBeeInfo = {
    nowPlayingTrack: null,
    trackTime: null,
    playerStatus: {
        playerMute: false,
        playerRepeat: "",
        playerShuffle: "off",
        playerState: "",
        playerVolume: "",
    },
};

export const MusicBeeInfoContext = React.createContext<MusicBeeInfo>(defaultContext);

export const MusicBeeInfoProvider: React.FC<{}> = props => {
    const [nowPlayingTrack, setNowPlayingTrack] = useState<NowPlayingTrack | null>(null);
    const [playerStatus, setPlayerStatus] = useObjectReducer(defaultContext.playerStatus);
    const [trackTime, setTrackTime] = useObjectReducer({ current: 0, total: 0 });

    const API = useContext(MusicBeeAPIContext);

    function setPlayerStatusFromApiData(data: any) {
        const { playerstate, playerrepeat, playershuffle, playermute, playervolume } = data;
        setPlayerStatus({
            playerState: playerstate,
            playerMute: playermute,
            playerRepeat: playerrepeat,
            playerShuffle: playershuffle,
            playerVolume: playervolume,
        });
    }

    // prettier-ignore
    useEffect(function initialize() {
        API.sendMessage("init", "");
        API.sendMessage("playerstatus", "");
        API.sendMessage("nowplayingposition", true);
    }, [API]);

    // prettier-ignore
    useEffect(function wireUpCallbacks() {
        const playerStateCallback = (playerState: MusicBeeInfo["playerStatus"]["playerState"]) => setPlayerStatus({ playerState });
        const playerVolumeCallback = (playerVolume: string) => setPlayerStatus({ playerVolume });
        const playerShuffleCallback = (playerShuffle: string) => setPlayerStatus({ playerShuffle });

        API.addEventListener("nowplayingposition", setTrackTime);
        API.addEventListener("nowplayingtrack", setNowPlayingTrack);
        API.addEventListener("playerstate", playerStateCallback);
        API.addEventListener("playervolume", playerVolumeCallback);
        API.addEventListener("playerstatus", setPlayerStatusFromApiData);
        API.addEventListener("playershuffle", playerShuffleCallback);

        return () => {
            API.removeEventListener("nowplayingposition", setTrackTime);
            API.removeEventListener("nowplayingtrack", setNowPlayingTrack);
            API.removeEventListener("playerstate", playerStateCallback);
            API.removeEventListener("playervolume", playerVolumeCallback);
            API.removeEventListener("playerstatus", setPlayerStatusFromApiData);
            API.removeEventListener("playershuffle", playerShuffleCallback);
        };
    }, [API, setTrackTime, setPlayerStatus, setNowPlayingTrack]);

    return (
        <MusicBeeInfoContext.Provider value={{ nowPlayingTrack, trackTime, playerStatus }}>
            {props.children}
        </MusicBeeInfoContext.Provider>
    );
};
