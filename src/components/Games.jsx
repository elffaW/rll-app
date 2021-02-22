import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Avatar, Paper, CircularProgress, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { NavLink, useLocation } from 'react-router-dom';

// import NotFound from './NotFound';
// import { lookupTabNumByPath } from '../utils/tabHelper';
// import faunadb from 'faunadb';
// import handler from '../api/games-getBySeason';
import BaseApp from './BaseApp';
import { convertGamesToMatches } from '../utils/dataUtils';

import * as images from '../images';

// const q = faunadb.query;
// const client = new faunadb.Client({
//   secret: process.env.FAUNADB_SECRET,
// });

const useStyles = makeStyles((theme) => ({
  gamePaper: {
    backgroundColor: theme.otherColors.background.mainDarker,
  },
  weekHeader: {
    fontFamily: 'Oswald',
    textShadow: '1px 1px 2px black',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(3),
    fontVariant: 'small-caps',
  },
  weekDate: {
    float: 'right',
  },
  // teamIcon: {
  //   width: `min(100%, ${theme.spacing(10)}px)`,
  //   height: `min(100%, ${theme.spacing(10)}px)`,
  // },
  teamName: {
    fontSize: '1.1rem',
    fontVariant: 'small-caps',
    marginLeft: theme.spacing(1),
    color: 'whitesmoke',
    fontWeight: 500,
    textShadow: '1px 1px 1px black',
    cursor: 'pointer',
  },
  teamDesc: {
    fontVariant: 'small-caps',
    fontSize: '1.6em',
    '& > span.first': {
      color: 'gold',
    },
    '& > span.last': {
      color: theme.palette.secondary.dark,
    },
  },
  teamRank: {
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'whitesmoke',
    textShadow: '1px 1px 2px black',
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  nameLoss: {
    color: theme.otherColors.text.light,
  },
  scoreLoss: {
    color: theme.palette.primary.darker,
  },
  scoreText: {
    fontSize: '1.1rem',
    marginLeft: theme.spacing(2),
  },
  resetButton: {
    cursor: 'pointer',
    fontVariant: 'small-caps',
    fontSize: '2rem',
    border: '1px solid gray',
    borderRadius: theme.spacing(1),
    boxShadow: '1px 1px 2px black',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.darkest,
  },
}));

export default function Games(props) {
  const { games } = props;
  
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
        // const response = await handler(5);
        // const queryResp = await client.query(q.Paginate(q.Match(q.Index('games_by_season'), 5), { size: 500 }));
        // const allRefs = queryResp.data;
        // const getAll = allRefs.map((ref) => q.Get(ref));

        // const response = await client.query(getAll);
        // const allGames = response.map((g) => g.data);

        // const matches = convertGamesToMatches(allGames);
        // matches.sort((a, b) => new Date(a.gameTime) - new Date(b.gameTime)); // earlier game times first

        // setGames(matches);
        // setFilteredGames(matches);
        setMatches(convertGamesToMatches(games));
        setFilteredGames(convertGamesToMatches(games) || []);
        setLoading(false);
    //   } catch (e) {
    //     console.error(e);
    //     setLoading(false);
    //   }
    // }

    // fetchData();
  }, []);

  /**
   * filters the displayed games by team name
   * @param {string} teamName team name to filter on
   */
  const filterGames = (teamName) => {
    if (matches && matches.length > 1) {
      if (!teamName) {
        setFilteredGames(matches);
      } else {
        const tempGames = matches.filter((game) => game.homeTeamName === teamName || game.awayTeamName === teamName);
        setFilteredGames(tempGames);
      }
    }
  };

  if (loading) {
    return (
      <BaseApp>
        <span style={{ left: '50%', position: 'relative' }}>
          <CircularProgress color="secondary" />
        </span>
      </BaseApp>
    );
  }

  let curWeek = 0;
  const allGames = [];
  filteredGames.forEach((game) => {
    let weekComponent = '';
    if (parseInt(game.gameWeek, 10) !== curWeek) {
      curWeek = parseInt(game.gameWeek, 10);
      weekComponent = (
        <Grid item xs={12} key={`gameweek-${curWeek}-row`}>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item xs={6}>
              <Typography variant="h4" className={classes.weekHeader}>
                {`Gameweek ${curWeek}`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" className={classes.weekHeader}>
                {game.arena}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="h6" className={`${classes.weekHeader} ${classes.weekDate}`}>
                {game.gameTime.split(' ')[0]}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    const logoSrc = images[`LOGO_${game.homeTeamName.replaceAll(' ', '_')}`];
    const oppLogoSrc = images[`LOGO_${game.awayTeamName.replaceAll(' ', '_')}`];
    const upperDivLogo = images['RLL_logo'];
    const lowerDivLogo = images['RLL_logo_lower'];

    const curGame = (
      <Grid item xs={12} md={6} key={`gameweek-${curWeek}-game-${game.matchNum}row`}>
        <Paper className={classes.gamePaper}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={2}>
              <Grid item>
                <Avatar
                  src={game.curDivision === '2' ? lowerDivLogo : upperDivLogo}
                  variant="square"
                  alt={`Division ${game.curDivision} logo`}
                />
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <Grid container direction="column">
                <Grid container justify="flex-start" alignItems="flex-end">
                  <Avatar src={logoSrc} variant="square" alt={`${game.homeTeamName} logo`} />
                  <Grid item xs>
                    <span className={`${classes.teamDesc} ${classes.teamRank}`}>
                      {game.homeTeamRank}
                    </span>
                    <span onClick={() => filterGames(game.homeTeamName)} className={`${classes.teamName} ${game.matchResult === 'L' ? classes.nameLoss : ''}`}>
                      {game.homeTeamName}
                    </span>
                  </Grid>
                  <Grid item xs>
                  {game.games.map((g) => (
                    <span className={`${g.homeWin ? classes.scoreWin : classes.scoreLoss} ${classes.scoreText}`}>
                      {g.homeTeamScore}
                    </span>
                  ))}
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" alignItems="flex-end">
                  <Avatar src={oppLogoSrc} variant="square" alt={`${game.awayTeamName} logo`} />
                  <Grid item xs>
                    <span className={`${classes.teamDesc} ${classes.teamRank}`}>
                      {game.awayTeamRank}
                    </span>
                    <span onClick={() => filterGames(game.awayTeamName)} className={`${classes.teamName} ${game.matchResult === 'W' ? classes.nameLoss : ''}`}>
                      {game.awayTeamName}
                    </span>
                  </Grid>
                  <Grid item xs>
                  {game.games.map((g) => (
                    <span className={`${!g.homeWin ? classes.scoreWin : classes.scoreLoss} ${classes.scoreText}`}>
                      {g.awayTeamScore}
                    </span>
                  ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );

    allGames.push(weekComponent);
    allGames.push(curGame);
  });

  return (
    <BaseApp>
      {matches.length !== filteredGames.length && (
        <Button onClick={() => filterGames()}>
          Show All
        </Button>
      )}
      <Grid container justify="flex-start" alignItems="flex-end">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {allGames}
          </Grid>
        </Grid>
      </Grid>
    </BaseApp>
  );
}
