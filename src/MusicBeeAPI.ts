import { createContext } from "react";

type EventListener = (data: any) => void;

export type QueueType = "next" | "last" | "add-all" | "now";

export interface Track {
    album: string;
    album_artist: string;
    artist: string;
    disc: string;
    genre: string;
    src: string;
    title: string;
    trackno: number;
}

export class MusicBeeAPI {
    static ENDPOINT: string = "ws://127.0.0.1:5000";

    webSocket?: WebSocket;
    allTracks?: Track[] = undefined;

    eventListeners: { [message: string]: EventListener[] } = {
        protocol: [],
        player: [],
        playerplaypause: [],
        ping: [() => this.sendMessage("pong", "")],
    };

    constructor(private onLoad: () => void) {}

    initialize() {
        // "browsetracks" data is relatively big, so it should be kept on API level
        this.addEventListener("browsetracks", ({ data }) => (this.allTracks = data));

        this.webSocket = new WebSocket(MusicBeeAPI.ENDPOINT);
        this.webSocket.addEventListener("open", this.runHandshake);
        this.webSocket.addEventListener("message", this.onMessage);
    }

    sendMessage = (context: string, data: any = "") => this.webSocket?.send(JSON.stringify({ context, data }));

    runHandshake = () => {
        this.sendMessage("player", "Web");
        this.addEventListener("protocol", this.onLoad);
        this.sendMessage("protocol", { no_broadcast: false, protocol_version: 5, client_id: "mb_web" });
    };

    onMessage = (message: MessageEvent<string>) => {
        const parsedMessageData = JSON.parse(message.data);

        const { context, data } = parsedMessageData;

        if (this.eventListeners[context]) {
            for (const listener of this.eventListeners[context]) {
                listener(data);
            }
        } else {
        console.log("Message:", parsedMessageData);
        }
    };

    addEventListener(message: string, listener: EventListener) {
        if (!this.eventListeners[message]) this.eventListeners[message] = [];
        this.eventListeners[message].push(listener);
    }

    removeEventListener(message: string, listener: EventListener) {
        if (!this.eventListeners[message]) return;

        this.eventListeners[message] = this.eventListeners[message].filter(x => x !== listener);
    }

    seek = (seekTo: number) => this.sendMessage("nowplayingposition", seekTo);
    setVolume = (volume: number) => this.sendMessage("playervolume", volume);

    browseAlbums = () => {
        this.sendMessage("browsealbums");
    };

    browseArtists = () => {
        this.sendMessage("browseartists");
    };

    browseTracks = () => {
        this.sendMessage("browsetracks");
    };

    browseGenres = () => {
        this.sendMessage("browsegenres");
    };

    playPause = () => {
        this.sendMessage("playerplaypause");
    };

    playPlaylist = (url: string) => {
        this.sendMessage("playlistplay", url);
    };

    skipPrevious = () => {
        this.sendMessage("playerprevious");
    };

    skipNext = () => {
        this.sendMessage("playernext");
    };

    queueTracks = (tracks: Track[], queueType: QueueType) => {
        const data = { data: tracks.map(track => track.src), queue: queueType, play: null };
        this.sendMessage("nowplayingqueue", data);
    };

    playTrackNow = (track: Track) => {
        this.queueTracks([track], "now");
    };
}

// I don't like setting a default value but I don't want to ts-ignore
export const MusicBeeAPIContext = createContext<MusicBeeAPI>(new MusicBeeAPI(() => {}));
