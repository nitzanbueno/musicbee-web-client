import React from "react";
import { List as VirtualList } from "react-virtualized";
import { ListItem, ListItemIcon, IconButton, ListItemText } from "@material-ui/core";
import { PlayArrow } from "@material-ui/icons";
import SizeCalculator from "./SizeCalculator";

export interface Song {
    title: string;
    artist: string;
}

// const useStyles = makeStyles(theme => ({
//     song: {
//         height: "40px",
//     },
// }));

const SongListItem: React.FC<{
    title: string;
    artist: string;
    itemHeight: number;
    onPlay: () => void;
    style: any;
}> = props => {
    // const classes = useStyles();
    // console.log("item", title);

    return (
        <ListItem style={{ height: props.itemHeight, ...props.style }}>
            <ListItemIcon>
                <IconButton onClick={props.onPlay}>
                    <PlayArrow />
                </IconButton>
            </ListItemIcon>
            <ListItemText primary={props.title} secondary={props.artist} />
        </ListItem>
    );
};

interface SongListProps {
    songs: Song[];
    onPlay: (index: number) => void;
    className?: string;
    songHeight?: number;
}

const SongListWrapper: React.FC<SongListProps> = props => {
    const { songHeight = 40 } = props;

    function renderRow({ index, key, style }: { index: number; key: any; style: any }) {
        const song = props.songs[index];
        return (
            <SongListItem
                onPlay={() => props.onPlay(index)}
                title={song.title}
                artist={song.artist}
                key={key}
                style={style}
                itemHeight={songHeight}
            ></SongListItem>
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
