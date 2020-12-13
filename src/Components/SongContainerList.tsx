import { IconButton, ListItem, ListItemIcon, ListItemText, makeStyles, SvgIcon } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import VirtualList from "./VirtualList";

const ITEM_HEIGHT = 60;

const useStyles = makeStyles({
    item: {
        cursor: "pointer",
        userSelect: "none",
        height: ITEM_HEIGHT + "px",
    },
});

interface Props<T> {
    items: T[];
    onDoubleClick: (item: T) => void;
    onIconClick: (item: T) => void;
    getTitle: (item: T) => string;
    icon: typeof SvgIcon;
    children?: (props: { item: T; close: () => void }) => React.ReactElement<any, any> | null;
    onOpen?: (item: T) => void;
    onClose?: () => void;
}

function SongContainerList<T>(props: Props<T>): React.ReactElement<any, any> | null {
    const classes = useStyles();

    const [chosenItem, setChosenItem] = useState<T | null>(null);

    function close() {
        props.onClose?.();
        setChosenItem(null);
    }

    function onIconClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: T) {
        // Without this line, the parent element's onClick event happens, causing the item to be selected
        e.stopPropagation();
        props.onIconClick(item);
    }

    function openItem(item: T) {
        props.onOpen?.(item);
        setChosenItem(item);
    }

    useEffect(close, [props.items, setChosenItem]);

    return chosenItem ? (
        props.children ? (
            props.children({ item: chosenItem, close })
        ) : null
    ) : (
        <VirtualList
            rowHeight={ITEM_HEIGHT}
            rowCount={props.items.length}
            rowRenderer={({ index, style }) => {
                const item = props.items[index];

                return (
                    <ListItem
                        onDoubleClick={() => props.onDoubleClick(item)}
                        onClick={() => openItem(item)}
                        key={index}
                        className={classes.item}
                        style={style}
                    >
                        <ListItemIcon>
                            <IconButton onClick={e => onIconClick(e, item)}>
                                <props.icon />
                            </IconButton>
                        </ListItemIcon>
                        <ListItemText primary={props.getTitle(item)} />
                    </ListItem>
                );
            }}
        />
    );
}

export default SongContainerList;
