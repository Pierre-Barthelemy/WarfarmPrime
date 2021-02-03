import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    bar: {
        padding: theme.spacing(1)
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        marginRight: theme.spacing(4),
        marginLeft: theme.spacing(4)
    },
    search: {
        position: 'relative',
        width: 350,
        marginRight: theme.spacing(4),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.25),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.40),
        },
    }
}));

const GoldSwitch = withStyles({
    switchBase: {
        color: yellow[200],
        '&$checked': {
            color: yellow[200],
        },
        '&$checked + $track': {
            backgroundColor: yellow[200],
        },
    },
    checked: {},
    track: {},
})(Switch);

export default function PrimarySearchAppBar({primeList, setSelected, setAllRelic, allRelic}) {
    const classes = useStyles();

    const handleSelected = (event, newValue) => {
            setAllRelic(newValue);
    }

    return (
        <div className={classes.grow}>
            <AppBar position="sticky">
                <Toolbar className={classes.bar}>
                    <Typography className={classes.title} variant="h6" noWrap>
                        WarFarmPrime
                    </Typography>
                    <Autocomplete
                        id="combo-box-demo"
                        className={classes.search}
                        onChange={(event, newValue) => {
                            setSelected(newValue);
                        }}
                        options={primeList}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Relics loots" variant="outlined" />}
                    />
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <GoldSwitch
                                    checked={allRelic}
                                    onChange={handleSelected}
                                    name="CheckAll"
                                    color="primary"
                                />
                            }
                            label="Vaulted relics"
                        />
                    </FormGroup>
                </Toolbar>
            </AppBar>
        </div>
    );
}
