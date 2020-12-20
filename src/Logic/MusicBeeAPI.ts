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

export interface DataPage<T> {
    offset: number;
    limit: number;
    data: T[];
    total: number;
}

export interface Playlist {
    name: string;
    url: string;
}

export class MusicBeeAPI {
    webSocket: WebSocket;
    didRequestDisconnect = false;

    constructor(public address: string, onLoad: () => void, onError: (e: Event) => void) {
        this.webSocket = new WebSocket(address);
        this.webSocket.addEventListener("error", onError);
        this.webSocket.addEventListener("open", () => {
            this.webSocket.removeEventListener("error", onError);
            this.runHandshake(onLoad);
        });
        this.webSocket.addEventListener("message", this.onMessage);
    }

    eventListeners: { [message: string]: EventListener[] } = {
        protocol: [],
        player: [],
        playerplaypause: [],
        ping: [() => this.sendMessage("pong", "")],
    };

    sendMessage = (context: string, data: any = "") => this.webSocket.send(JSON.stringify({ context, data }));

    runHandshake = (onLoad: () => void) => {
        this.sendMessage("player", "Web");
        this.addEventListener("protocol", onLoad);
        this.sendMessage("protocol", { no_broadcast: false, protocol_version: 5, client_id: "mb_web" });
    };

    onMessage = (message: MessageEvent<string>) => {
        const parsedMessageData = JSON.parse(message.data);

        const { context, data } = parsedMessageData;

        if (this.eventListeners[context]) {
            for (const listener of this.eventListeners[context]) {
                listener(data);
            }
        } else if (process.env.NODE_ENV === "development") {
            console.log("Message:", parsedMessageData);
        }
    };

    disconnect() {
        this.didRequestDisconnect = true;
        this.webSocket.close();
    }

    addEventListener(message: string, listener: EventListener) {
        if (!this.eventListeners[message]) this.eventListeners[message] = [];
        this.eventListeners[message].push(listener);
    }

    removeEventListener(message: string, listener: EventListener) {
        if (!this.eventListeners[message]) return;

        this.eventListeners[message] = this.eventListeners[message].filter(x => x !== listener);
    }

    addErrorListener(listener: (e: Event) => void) {
        this.webSocket.addEventListener("error", listener);
        this.webSocket.addEventListener("close", listener);
    }

    removeErrorListener(listener: (e: Event) => void) {
        this.webSocket.removeEventListener("error", listener);
        this.webSocket.removeEventListener("close", listener);
    }

    seek = (seekTo: number) => this.sendMessage("nowplayingposition", seekTo);
    setVolume = (volume: number) => this.sendMessage("playervolume", volume);

    /**
     * Sends a message and awaits a response from the server.
     * Use only when the message is a command, and NOT when the message is an event handler (e.g. playerstate).
     * @param context The context of the message.
     * @param data The optional data.
     * @param responseContext The desired context of the response message (default is the same one sent).
     * @returns The resulting data of the response message.
     */
    sendMessageAndGetResponseAsync<T>(context: string, data?: any, responseContext: string = context): Promise<T> {
        return new Promise(resolve => {
            const listener = (result: T) => {
                this.removeEventListener(responseContext, listener);
                resolve(result);
            };

            this.addEventListener(responseContext, listener);
            this.sendMessage(context, data);
        });
    }

    async browsePaginatedDataAsync<T>(message: string, pageSize: number = 5000): Promise<T[]> {
        const result: T[] = [];

        let offset = 0;
        let currentPage: DataPage<T>;

        do {
            currentPage = await this.sendMessageAndGetResponseAsync(message, { offset, limit: pageSize });

            result.push(...currentPage.data);
            offset += currentPage.limit;
        } while (offset < currentPage.total);

        return result;
    }

    browseArtistsAsync() {
        return this.browsePaginatedDataAsync("browseartists");
    }

    browseTracksAsync(): Promise<Track[]> {
        return this.browsePaginatedDataAsync("browsetracks");
    }

    browseGenresAsync() {
        return this.browsePaginatedDataAsync("browsegenres");
    }

    browsePlaylistsAsync(): Promise<Playlist[]> {
        return this.browsePaginatedDataAsync("playlistlist");
    }

    playPause = () => {
        this.sendMessage("playerplaypause");
    };

    playPlaylist = (url: string) => {
        this.sendMessage("playlistplay", url);
    };

    playPlaylistAsync = (url: string) => {
        return this.sendMessageAndGetResponseAsync("playlistplay", url);
    };

    playFromNowPlayingList(position: number) {
        this.sendMessage("nowplayinglistplay", position);
    }

    removeFromNowPlayingList(position: number) {
        this.sendMessage("nowplayinglistremove", position);
    }

    getPlaylistTracksAsync(url: string) {
        return this.sendMessageAndGetResponseAsync<Track[]>("playlistlistsongs", url);
    }

    toggleShuffle = () => {
        this.sendMessage("playershuffle", "toggle");
    };

    toggleRepeat = () => {
        this.sendMessage("playerrepeat", "toggle");
    };

    skipPrevious = () => {
        this.sendMessage("playerprevious");
    };

    skipNext = () => {
        this.sendMessage("playernext");
    };

    queueTracksAsync = (queueType: QueueType, ...tracks: Track[]): Promise<void> => {
        const data = { data: tracks.map(track => track.src), queue: queueType, play: null };
        return this.sendMessageAndGetResponseAsync("nowplayingqueue", data);
    };

    playTrackNowAsync = (track: Track): Promise<void> => {
        return this.queueTracksAsync("now", track);
    };

    addToPlaylistAsync = (playlist: Playlist, ...tracks: Track[]): Promise<void> => {
        return this.sendMessageAndGetResponseAsync("playlistaddfiles", {
            url: playlist.url,
            filenames: tracks.map(track => track.src),
        });
    };
}

// @ts-ignore
export const MusicBeeAPIContext = createContext<MusicBeeAPI>();
