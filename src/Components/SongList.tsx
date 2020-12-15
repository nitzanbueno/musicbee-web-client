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
    onClickIcon: () => void;
    onDoubleClick: () => void;
    onContextMenu?: (e: React.MouseEvent<any>) => void;
    paused?: boolean;
    style: any;
    classes: any;
    renderSecondaryAction?: () => ReactNode;
}> = props => {
    const { paused = true } = props;

    function onContextMenu(e: React.MouseEvent<any>) {
        if (!props.onContextMenu) return;
        e.preventDefault();
        props.onContextMenu(e);
    }

    return (
        <div style={{ ...props.style, height: props.itemHeight }}>
            <ListItem onDoubleClick={props.onDoubleClick} onContextMenu={onContextMenu}>
                <ListItemIcon>
                    <IconButton onClick={props.onClickIcon}>{paused ? <PlayArrow /> : <Pause />}</IconButton>
                </ListItemIcon>
                <ListItemText primary={props.title} secondary={props.artist} className={props.classes.songItemText} />
                {props.renderSecondaryAction ? (
                    <ListItemSecondaryAction children={props.renderSecondaryAction()} />
                ) : null}
            </ListItem>
        </div>
    );
};

export interface SongListProps<T> {
    songs: T[];
    titleKey?: string;
    artistKey?: string;
    pathKey?: string;
    onPlay: (song: T, index: number) => void;
    onTogglePlayPause: () => void;
    flex?: boolean;
    songHeight?: number;
    renderSecondaryAction?: (song: T, index: number) => ReactNode;
    onContextMenu?: (e: React.MouseEvent<any>, song: T, index: number) => void;
}

function SongList<T>(props: SongListProps<T>): React.ReactElement<any, any> {
    const { songHeight = 60, titleKey = "title", artistKey = "artist", pathKey = "src", renderSecondaryAction } = props;
    const { nowPlayingTrack, playerStatus } = useContext(MusicBeeInfoContext);
    const classes = useStyles();

    function renderRow({ index, key, style }: { index: number; key: any; style: any }) {
        const song = props.songs[index];
        const onPlay = () => props.onPlay(song, index);
        const paused = playerStatus.playerState !== "playing";
        const isPlaying = song[pathKey] === nowPlayingTrack?.path;

        return (
            <SongListItem
                onClickIcon={isPlaying ? props.onTogglePlayPause : onPlay}
                onDoubleClick={onPlay}
                onContextMenu={props.onContextMenu && (e => props.onContextMenu?.(e, song, index))}
                paused={isPlaying ? paused : undefined}
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
