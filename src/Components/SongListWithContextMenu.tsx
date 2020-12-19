import React, { useContext, useState } from "react";
import SongList from "./SongList";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { MusicBeeAPIContext, Track } from "../Logic/MusicBeeAPI";

interface SongListWithContextMenuProps {
    songs: Track[];
    onPlay: (song: Track, index: number) => void;
    flex?: boolean;
    songHeight?: number;
}

const SongMenu: React.FC<{
    queueNext: () => void;
    queueLast: () => void;
    onClose: () => void;
    anchorEl: Element | null;
    anchorPosition?: { x: number; y: number };
}> = props => {
    function closeAndRun(f: Function) {
        return () => {
            props.onClose();
            f();
        };
    }
    function handleContextMenuClose(e: React.MouseEvent<any>) {
        /**
         * Why is this function?
         * Well.
         * When you right-click a song while a menu open, you get the native context menu.
         * Ideally, what I'd like to happen would be that the context menu for the song you right-clicked would open.
         * However, that is close to impossible.
         * This is because the Material-UI menu generates a "backdrop" div, which closes the menu when you click outside of it.
         * I want that to happen, but that causes right-clicks on songs (or anything else) to get registered in
         * the backdrop as well.
         * I haven't found a nice way to have left-clicks registered in the backdrop but right-clicks pass through it.
         * The only feasible way I found was to use document.elementFromPoint() with the event coordinates and use dispatchEvent to pass
         * the event onwards. Pretty ugly, and didn't work after a small attempt, so I dropped the idea.
         * Now right-clicking with the menu open closes the menu. Non-ideal, but it's the best I could do.
         */

        e.preventDefault();
        props.onClose();
    }

    return (
        <>
            <Menu
                anchorPosition={props.anchorPosition && { top: props.anchorPosition.y, left: props.anchorPosition.x }}
                anchorReference={props.anchorEl ? "anchorEl" : "anchorPosition"}
                anchorEl={props.anchorEl}
                open={!!props.anchorEl || !!props.anchorPosition}
                onClose={props.onClose}
                // For explanation look at handleContextMenuClose documentation
                BackdropProps={{
                    onContextMenu: handleContextMenuClose,
                    invisible: true, // For some reason this gets reset when you specify BackdropProps
                }}
            >
                <MenuItem onClick={closeAndRun(props.queueNext)}>Queue Next</MenuItem>
                <MenuItem onClick={closeAndRun(props.queueLast)}>Queue Last</MenuItem>
            </Menu>
        </>
    );
};

export default function SongListWithContextMenu(props: SongListWithContextMenuProps): React.ReactElement<any, any> {
    const API = useContext(MusicBeeAPIContext);

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [anchorPosition, setAnchorPosition] = useState<{ x: number; y: number } | undefined>(undefined);
    const [currentOpenTrack, setCurrentOpenTrack] = useState<Track | null>(null);

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, track: Track) {
        setAnchorEl(e.currentTarget);
        setCurrentOpenTrack(track);
    }

    function close() {
        setAnchorEl(null);
        setAnchorPosition(undefined);
    }

    function handleContextMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, track: Track) {
        e.preventDefault();
        setAnchorPosition({ x: e.clientX, y: e.clientY });
        setCurrentOpenTrack(track);
    }

    function renderSecondaryAction(track: Track) {
        return (
            <IconButton onClick={e => handleClick(e, track)}>
                <MoreVert />
            </IconButton>
        );
    }

    return (
        <>
            <SongList
                {...props}
                artistKey="artist"
                titleKey="title"
                pathKey="src"
                onTogglePlayPause={API.playPause}
                renderSecondaryAction={renderSecondaryAction}
                onContextMenu={handleContextMenu}
            />
            <SongMenu
                queueNext={() => currentOpenTrack && API.queueTracksAsync("next", currentOpenTrack)}
                queueLast={() => currentOpenTrack && API.queueTracksAsync("last", currentOpenTrack)}
                anchorEl={anchorEl}
                anchorPosition={anchorPosition}
                onClose={close}
            />
        </>
    );
}
