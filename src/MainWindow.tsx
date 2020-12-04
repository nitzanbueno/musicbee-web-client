import { AppBar, fade, InputBase, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import { Search as SearchIcon } from "@material-ui/icons";
import Playlists from "./Playlists";
import SongPicker from "./SongPicker";

const useStyles = makeStyles((theme) => ({
    container: {
        gridColumn: "2 / 3",
        gridRow: "1 / 2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    active: {
        backgroundColor: theme.palette.background.default,
    },
    appBar: {
        backgroundColor: theme.palette.grey[700],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const SearchBar: React.FC<{
    classes: any;
    value: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ classes, value, onChange }) => (
    <div className={classes.search}>
        <div className={classes.searchIcon}>
            <SearchIcon />
        </div>
        <InputBase
            placeholder="Search…"
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={value}
            onChange={onChange}
        />
    </div>
);

const MainWindow: React.FC<{}> = () => {
    // const [customContext, setCustomContext] = useState("");
    // const [customData, setCustomData] = useState("");
    const classes = useStyles();

    const [value, setValue] = useState(0);
    const [query, setQuery] = useState("");

    return (
        <div className={classes.container}>
            <AppBar className={classes.appBar} position="static">
                <Tabs value={value} onChange={(_, x) => setValue(x)} aria-label="simple tabs example">
                    <Tab label="Songs" />
                    <Tab label="Playlists" />
                </Tabs>
                <SearchBar classes={classes} value={query} onChange={(e) => setQuery(e.target.value)} />
            </AppBar>

            {value === 0 && <SongPicker />}
            {value === 1 && <Playlists />}
            {/* Custom: 
            <input onChange={(e) => setCustomContext(e.target.value)} value={customContext} />
            <input onChange={(e) => setCustomData(e.target.value)} value={customData} />
            <button onClick={() => API.sendMessage(customContext, JSON.parse(customData))}>Send</button> */}
        </div>
    );
};

export default MainWindow;
