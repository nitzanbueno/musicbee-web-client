import { AppBar, fade, IconButton, InputBase, makeStyles, Tab, Tabs } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { ExitToApp, Search as SearchIcon } from "@material-ui/icons";
import Playlists from "./Playlists";
import SongPicker from "./SongPicker";
import { MusicBeeAPIContext } from "../Logic/MusicBeeAPI";
import Albums from "./Albums";

const useStyles = makeStyles(theme => ({
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
    right: {
        marginLeft: "auto",
    },
}));

const SearchBar: React.FC<{
    classes: ReturnType<typeof useStyles>;
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
    const classes = useStyles();

    const [tabIndex, setTabIndex] = useState(0);
    const [searchText, setSearchText] = useState("");
    const API = useContext(MusicBeeAPIContext);

    function switchTab(_: unknown, tab: number) {
        setTabIndex(tab);
        setSearchText("");
    }

    return (
        <div className={classes.container}>
            <AppBar className={classes.appBar} position="static">
                <Tabs value={tabIndex} onChange={switchTab} aria-label="MusicBee tabs" indicatorColor="primary">
                    <Tab label="Songs" />
                    <Tab label="Playlists" />
                    <Tab label="Albums" />
                </Tabs>
                <SearchBar classes={classes} value={searchText} onChange={e => setSearchText(e.target.value)} />
                <IconButton className={classes.right} onClick={() => API.disconnect()}>
                    <ExitToApp />
                </IconButton>
            </AppBar>

            {tabIndex === 0 && <SongPicker searchText={searchText} />}
            {tabIndex === 1 && <Playlists searchText={searchText} />}
            {tabIndex === 2 && <Albums searchText={searchText} />}
        </div>
    );
};

export default MainWindow;
