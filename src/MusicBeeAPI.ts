export interface MusicBeeState {
    playerStatus: {
        playerMute: boolean;
        playerRepeat: string;
        playerShuffle: boolean;
        playerState: string;
        playerVolume: string;
    };
    trackTime: number;
    trackLength: number;
    nowPlayingTrack: { artist: string; title: string; album: string; year: string };
}

type RecursivePartial<T> = {
    [P in keyof T]?: Partial<T[P]>;
};

type EventListener = (data: any) => void;

export type MusicBeeStateDispatch = (action: RecursivePartial<MusicBeeState>) => void;

export class MusicBeeAPI {
    static ENDPOINT: string = "ws://127.0.0.1:5000";

    webSocket?: WebSocket;

    eventListeners: { [message: string]: EventListener[] } = {
        protocol: [],
        player: [],
        playerplaypause: [],
        ping: [() => this.sendMessage("pong", "")],
    };

    constructor(private onLoad: () => void) {}

    initialize() {
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

        this.eventListeners[message] = this.eventListeners[message].filter((x) => x != listener);
    }

    seek = (seekTo: number) => this.sendMessage("nowplayingposition", seekTo);
    setVolume = (volume: number) => this.sendMessage("playervolume", volume);

    browseAlbums = () => {
        // TODO: set the limit smarter
        this.sendMessage("browsealbums", { offset: 0, limit: 800 });
    };

    playPause = () => {
        this.sendMessage("playerplaypause");
    };

    skipPrevious = () => {
        this.sendMessage("playerprevious");
    };

    skipNext = () => {
        this.sendMessage("playernext");
    };
}
