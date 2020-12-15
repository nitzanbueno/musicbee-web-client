import { Button, CircularProgress, makeStyles, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ErrorText from "../Components/ErrorText";
import { MusicBeeAPI } from "../Logic/MusicBeeAPI";

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

const ConnectForm: React.FC<{
    autoConnect: boolean;
    error: boolean;
    onConnect: (API: MusicBeeAPI) => void;
}> = props => {
    const [address, setAddress] = useState(() => localStorage.getItem(ADDRESS_KEY));
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    function handleError() {
        setError(true);
        setLoading(false);
    }

    function handleLoad(API: MusicBeeAPI) {
        // Set the key on success!
        localStorage.setItem(ADDRESS_KEY, API.address);
        props.onConnect(API);
    }

    function connect(e?: React.FormEvent) {
        e?.preventDefault();

        // This is a sketchy line
        const API = new MusicBeeAPI(address ?? DEFAULT_ADDRESS, () => handleLoad(API), handleError);

        setLoading(true);
        setError(false);
    }

    useEffect(() => {
        // If we should autoconnect, try connecting to the previous address on load (if exists)
        if (props.autoConnect) connect();

        // eslint-disable-next-line
    }, [props.autoConnect]);

    return (
        <form className={classes.container} onSubmit={connect}>
            {props.error && <ErrorText>The server has disconnected. Please reconnect.</ErrorText>}
            Connect to:
            <TextField
                variant="outlined"
                value={address ?? DEFAULT_ADDRESS}
                onChange={e => setAddress(e.target.value)}
            />
            <Button type="submit" variant="contained">
                Connect
            </Button>
            {loading && <CircularProgress />}
            {error && <ErrorText>There has been an error connecting. Please try again.</ErrorText>}
        </form>
    );
};

export default ConnectForm;
