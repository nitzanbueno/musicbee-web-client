import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    error: {
        color: theme.palette.error.light,
    },
}));

const ErrorText: React.FC<{}> = props => {
    const classes = useStyles();

    return <span className={classes.error}>{props.children}</span>;
};

export default ErrorText;
