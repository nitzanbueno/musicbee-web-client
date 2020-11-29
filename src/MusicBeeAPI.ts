interface State {
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

export class MusicBeeAPI {
    static ENDPOINT: string = "ws://127.0.0.1:5000";

    static Reducer(prevState: State, action: RecursivePartial<State>): State {
        const result: any = { ...prevState };

        for (const i of Object.keys(action)) {
            // @ts-ignore
            const newValue: any = action[i];
            if (typeof newValue === "object") {
                result[i] = { ...result[i], ...newValue };
            } else {
                result[i] = newValue;
            }
        }

        return result;
    }

    static InitialState: State = {
        playerStatus: {
            playerMute: false,
            playerRepeat: "",
            playerShuffle: false,
            playerState: "",
            playerVolume: "",
        },
        trackTime: 0,
        trackLength: 0,
        nowPlayingTrack: { artist: "", title: "", album: "", year: "" },
    };

    webSocket?: WebSocket;
    constructor(public dispatch: (action: RecursivePartial<State>) => void) {}

    initialize() {
        this.webSocket = new WebSocket(MusicBeeAPI.ENDPOINT);
        this.webSocket.addEventListener("open", this.runHandshake);
        this.webSocket.addEventListener("message", this.onMessage);
    }

    sendMessage = (context: string, data: any) => this.webSocket?.send(JSON.stringify({ context, data }));

    runHandshake = () => {
        this.sendMessage("player", "Web");
        this.sendMessage("protocol", { no_broadcast: false, protocol_version: 5, client_id: "mb_web" });
        this.sendMessage("init", "");
        this.sendMessage("playerstatus", "");
        this.sendMessage("nowplayingposition", true);
    };

    onMessage = (message: MessageEvent<string>) => {
        const parsedMessageData = JSON.parse(message.data);

        const { context, data } = parsedMessageData;

        switch (context) {
            case "protocol":
            case "player":
            case "playerplaypause": // This seems to always return what I send...
                return;
            case "ping":
                this.sendMessage("pong", "");
                break;
            case "nowplayingposition":
                this.dispatch({ trackTime: data.current, trackLength: data.total });
                break;
            case "nowplayingtrack":
                this.dispatch({ nowPlayingTrack: data });
                break;
            case "playerstate":
                this.dispatch({ playerStatus: { playerState: data } });
                break;
            case "playerstatus":
                console.log(data);
                this.dispatch({
                    playerStatus: {
                        playerMute: data.playermute,
                        playerRepeat: data.playerrepeat,
                        playerShuffle: data.playershuffle,
                        playerState: data.playerstate,
                        playerVolume: data.playervolume,
                    },
                });
                break;
            default:
                console.log("Message:", parsedMessageData);
                break;
        }
    };

    seek = (seekTo: number) => this.sendMessage("nowplayingposition", seekTo);

    browseAlbums = () => {
        // TODO: set the limit smarter
        this.sendMessage("browsealbums", { offset: 0, limit: 800 });
    };

    playPause = () => {
        this.sendMessage("playerplaypause", true);
    };
}
