import React, { CSSProperties, ReactNode, useContext } from "react";
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
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableRubric,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    OnDragEndResponder,
} from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({
    songItemText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        userSelect: "none",
        color: theme.palette.text.primary,
    },
    songList: {
        listStyleType: "none", // For some reason the bullet points show on Chrome...
    },
}));

const SongListItem: React.FC<{
    title: string;
    artist: string;
    itemHeight: number;
    onClickIcon?: () => void;
    onDoubleClick?: () => void;
    onContextMenu?: (e: React.MouseEvent<any>) => void;
    paused?: boolean;
    style: CSSProperties;
    classes: ReturnType<typeof useStyles>;
    renderSecondaryAction?: () => ReactNode;
    provided?: DraggableProvided;
    className?: string;
}> = props => {
    const { paused = true } = props;

    function onContextMenu(e: React.MouseEvent<any>) {
        if (!props.onContextMenu) return;
        e.preventDefault();
        props.onContextMenu(e);
    }

    return (
        <div
            {...props.provided?.draggableProps}
            {...props.provided?.dragHandleProps}
            style={{ ...props.provided?.draggableProps.style, ...props.style, height: props.itemHeight }}
            ref={props.provided?.innerRef}
        >
            <ListItem className={props.className} onDoubleClick={props.onDoubleClick} onContextMenu={onContextMenu}>
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

export type SongListProps<T> = {
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
} & (
    | {
          draggable: false | undefined;
      }
    | {
          draggable: true;
          onDragEnd: OnDragEndResponder;
          draggedClassName?: string;
      }
);

export default function SongList<T>(props: SongListProps<T>): React.ReactElement<any, any> {
    const { songHeight = 60, titleKey = "title", artistKey = "artist", pathKey = "src", renderSecondaryAction } = props;
    const { nowPlayingTrack, playerStatus } = useContext(MusicBeeInfoContext);
    const classes = useStyles();

    function getSongListItemProps({
        index,
        key,
        style,
    }: {
        index: number;
        key: string | number;
        style: CSSProperties;
    }) {
        const song = props.songs[index];
        const onPlay = () => props.onPlay(song, index);
        const paused = playerStatus.playerState !== "playing";
        const isPlaying = song[pathKey] === nowPlayingTrack?.path;

        return {
            onClickIcon: isPlaying ? props.onTogglePlayPause : onPlay,
            onDoubleClick: onPlay,
            onContextMenu: props.onContextMenu && (e => props.onContextMenu?.(e, song, index)),
            paused: isPlaying ? paused : undefined,
            title: song[titleKey],
            artist: song[artistKey],
            key: key,
            style: style,
            itemHeight: songHeight,
            classes: classes,
            renderSecondaryAction: renderSecondaryAction && (() => renderSecondaryAction(song, index)),
        };
    }

    function renderRow(data: { index: number; key: string | number; style: any }) {
        return props.draggable ? (
            <Draggable draggableId={data.key.toString()} index={data.index} key={data.key}>
                {provided => <SongListItem {...getSongListItemProps(data)} provided={provided} />}
            </Draggable>
        ) : (
            <SongListItem {...getSongListItemProps(data)} />
        );
    }

    if (!props.draggable)
        return (
            <VirtualList
                className={classes.songList}
                flex={props.flex}
                rowHeight={songHeight}
                rowCount={props.songs.length}
                rowRenderer={renderRow}
            />
        );
    else
        return (
            <DragDropContext onDragEnd={props.onDragEnd}>
                <Droppable
                    droppableId="droppable"
                    mode="virtual"
                    renderClone={(provided: DraggableProvided, _: DraggableStateSnapshot, rubric: DraggableRubric) => {
                        const { renderSecondaryAction: __, ...songListItemProps } = getSongListItemProps({
                            index: rubric.source.index,
                            key: "dragging",
                            style: { listStyleType: "none" },
                        });

                        return (
                            <SongListItem
                                {...songListItemProps}
                                provided={provided}
                                className={props.draggedClassName}
                            />
                        );
                    }}
                >
                    {(provided: DroppableProvided) => (
                        <VirtualList
                            className={classes.songList}
                            flex={props.flex}
                            rowHeight={songHeight}
                            rowCount={props.songs.length}
                            innerRef={provided.innerRef}
                            rowRenderer={renderRow}
                        />
                    )}
                </Droppable>
            </DragDropContext>
        );
}
