import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import PrimarySearchAppBar from './components/TopMenus'
import Table from "./components/Table"
import './App.css';

function Copyright() {
  return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © Pimani '}
        <Link color="inherit" href="http://WarFarmPrime.com/">
            WarFarmPrime.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    App: {
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    Content: {
        flexGrow: 1,
        margin: theme.spacing(2),
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: theme.spacing(4),
    },
}));

function App() {

    const [apiData, setData] = useState({primeParts: []})
    const [selectedPrime, setSelected] = useState()
    const [allRelic, setAllRelic] = useState(false)

    useEffect(() => {
        fetch('http://api.warfarmprime.com')
            .then(res => res.json())
            .then((data) => {
                let primePart = []
                data.Relics.filter(relic => allRelic ? true : relic.Vaulted === allRelic).forEach(relic => {
                    relic.Common.forEach(loot => {
                        if (!primePart.includes(loot)) {
                            primePart.push(loot)
                        }
                    })
                    relic.Uncommon.forEach(loot => {
                        if (!primePart.includes(loot)) {
                            primePart.push(loot)
                        }
                    })
                    relic.Rare.forEach(loot => {
                        if (!primePart.includes(loot)) {
                            primePart.push(loot)
                        }
                    })
                })
                setData({ primeParts: primePart, ...data } )
            })
    }, [allRelic]);

    const classes = useStyles();
    return (
        <div className={classes.App}>
            <header>
                <PrimarySearchAppBar
                    setAllRelic={setAllRelic}
                    primeList={apiData.primeParts}
                    allRelic={allRelic}
                    setSelected={setSelected}
                />
            </header>
            <div className={classes.Content}>
                <Table allRelic={allRelic} apiData={apiData} selectedPrime={selectedPrime} />
            </div>
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    WarfarmPrime
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Simple site to help find relics for prime part.
                </Typography>
                <Copyright />
            </footer>
        </div>
  );
}

export default App;
