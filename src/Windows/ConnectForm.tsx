import { Button, CircularProgress, makeStyles, TextField } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { MusicBeeAPIContext } from "../Logic/MusicBeeAPI";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "& > *": {
            margin: 5,
        },
    },
}));

const ADDRESS_KEY = "LastConnectedAddress";
const DEFAULT_ADDRESS = "ws://0.0.0.0:3000";

const ConnectForm: React.FC<{ onLoad: () => void }> = props => {
    const [address, setAddress] = useState(() => localStorage.getItem(ADDRESS_KEY) ?? DEFAULT_ADDRESS);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const API = useContext(MusicBeeAPIContext);

    const classes = useStyles();

    function handleError() {
        setError(true);
        setLoading(false);
    }

    function handleLoad(connectedAddress: string) {
        // Set the key on success!
        localStorage.setItem(ADDRESS_KEY, connectedAddress);
        props.onLoad();
    }

    function connect(e: React.FormEvent) {
        e.preventDefault();

        API.tryConnect(address, handleLoad, handleError);
        setLoading(true);
        setError(false);
    }

    return (
        <form className={classes.container} onSubmit={connect}>
            Connect to:
            <TextField variant="outlined" value={address} onChange={e => setAddress(e.target.value)} />
            <Button type="submit" variant="contained">
                Connect
            </Button>
            {loading && <CircularProgress />}
            {error && "There has been an error connecting. Please try again."}
        </form>
    );
};

export default ConnectForm;
