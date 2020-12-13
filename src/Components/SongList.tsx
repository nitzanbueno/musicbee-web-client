import React, { ReactNode, useContext } from "react";
import {
    ListItem,
    ListItemIcon,
    IconButton,
    ListItemText,
    makeStyles,
    ListItemSecondaryAction,
} from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";
import { MusicBeeInfoContext } from "../Logic/MusicBeeInfo";
import VirtualList from "./VirtualList";

const useStyles = makeStyles(() => ({
    songItemText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        userSelect: "none",
    },
    songList: {
        listStyleType: "none", // For some reason the bullet points show on Chrome...
    },
}));

const SongListItem: React.FC<{
    title: string;
    artist: string;
    itemHeight: number;
    onPlay: () => void;
    paused?: boolean;
    style: any;
    classes: any;
    renderSecondaryAction?: () => ReactNode;
}> = props => {
    const { paused = true } = props;

    return (
        <div style={{ ...props.style, height: props.itemHeight }}>
            <ListItem onDoubleClick={props.onPlay}>
                <ListItemIcon>
                    <IconButton onClick={props.onPlay}>{paused ? <PlayArrow /> : <Pause />}</IconButton>
                </ListItemIcon>
                <ListItemText primary={props.title} secondary={props.artist} className={props.classes.songItemText} />
                {props.renderSecondaryAction ? (
                    <ListItemSecondaryAction children={props.renderSecondaryAction()} />
                ) : null}
            </ListItem>
        </div>
    );
};

interface SongListProps<T> {
    songs: T[];
    titleKey?: string;
    artistKey?: string;
    pathKey?: string;
    onPlay: (song: T, index: number) => void;
    onTogglePlayPause: () => void;
    flex?: boolean;
    songHeight?: number;
    renderSecondaryAction?: (song: T, index: number) => ReactNode;
}

function SongList<T>(props: SongListProps<T>): React.ReactElement<any, any> {
    const { songHeight = 60, titleKey = "title", artistKey = "artist", pathKey = "src", renderSecondaryAction } = props;
    const { nowPlayingTrack, playerStatus } = useContext(MusicBeeInfoContext);
    const classes = useStyles();

    function renderRow({ index, key, style }: { index: number; key: any; style: any }) {
        const song = props.songs[index];
        let onPlay: () => void;
        let paused: boolean | undefined = undefined;

        if (song[pathKey] === nowPlayingTrack?.path) {
            onPlay = props.onTogglePlayPause;
            paused = playerStatus.playerState !== "playing";
        } else {
            onPlay = () => props.onPlay(song, index);
        }

        return (
            <SongListItem
                onPlay={onPlay}
                paused={paused}
                title={song[titleKey]}
                artist={song[artistKey]}
                key={key}
                style={style}
                itemHeight={songHeight}
                classes={classes}
                renderSecondaryAction={renderSecondaryAction && (() => renderSecondaryAction(song, index))}
            />
        );
    }

    return (
        <VirtualList
            className={classes.songList}
            flex={props.flex}
            rowHeight={songHeight}
            rowCount={props.songs.length}
            rowRenderer={renderRow}
        />
    );
}

export default SongList;
