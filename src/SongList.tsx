import React, { useContext } from "react";
import { List as VirtualList } from "react-virtualized";
import { ListItem, ListItemIcon, IconButton, ListItemText } from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";
import SizeCalculator from "./SizeCalculator";
import { MusicBeeInfoContext } from "./MusicBeeInfo";

const SongListItem: React.FC<{
    title: string;
    artist: string;
    itemHeight: number;
    onPlay: () => void;
    paused?: boolean;
    style: any;
}> = props => {
    const { paused = true } = props;

    return (
        <ListItem style={{ height: props.itemHeight, ...props.style }}>
            <ListItemIcon>
                <IconButton onClick={props.onPlay}>{paused ? <PlayArrow /> : <Pause />}</IconButton>
            </ListItemIcon>
            <ListItemText primary={props.title} secondary={props.artist} />
        </ListItem>
    );
};

interface SongListProps {
    songs: any[];
    titleKey: string;
    artistKey: string;
    pathKey: string;
    onSet: (index: number) => void;
    onTogglePlayPause: () => void;
    className?: string;
    songHeight?: number;
}

const SongListWrapper: React.FC<SongListProps> = props => {
    const { songHeight = 40, titleKey, artistKey, pathKey } = props;
    const { nowPlayingTrack, playerStatus } = useContext(MusicBeeInfoContext);

    function renderRow({ index, key, style }: { index: number; key: any; style: any }) {
        const song = props.songs[index];
        let onPlay: () => void;
        let paused: boolean | undefined = undefined;

        if (song[pathKey] === nowPlayingTrack?.path) {
            onPlay = props.onTogglePlayPause;
            console.log(playerStatus.playerState);
            paused = playerStatus.playerState === "Paused";
        } else {
            onPlay = () => props.onSet(index);
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
            />
        );
    }

    return (
        <SizeCalculator className={props.className}>
            {({ width, height }) => (
                <VirtualList
                    rowHeight={songHeight}
                    width={width}
                    height={height}
                    rowCount={props.songs.length}
                    rowRenderer={renderRow}
                />
            )}
        </SizeCalculator>
    );
};

export { SongListWrapper as SongList };
