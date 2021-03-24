import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Avatar, Paper, CircularProgress, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import memoize from 'memoizee';

import BaseApp from './BaseApp';
import { convertGamesToMatches } from '../utils/dataUtils';

import * as images from '../images';

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
  linkStyle: {
    cursor: 'pointer',
  },
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
  scoreSection: {
    paddingTop: theme.spacing(0.5),
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
  largeIcon: {
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
  streamText: {
    transform: 'rotate(-90deg)',
    fontVariant: 'small-caps',
    color: 'inherit',
    marginTop: theme.spacing(8),
    fontWeight: 700,
  },
}));

export default function Games(props) {
  const { games, teams } = props;
  
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  const [filterTeam, setFilterTeam] = useState('');

  useEffect(() => {
    const convertedGames = convertGamesToMatches(games);
    convertedGames?.sort((a, b) => ( // earlier game times first, then gongshow order
      new Date(a.gameTime) - new Date(b.gameTime) !== 0
      ? new Date(a.gameTime) - new Date(b.gameTime)
      : parseInt(a.streamRoom.slice(-1), 10) - parseInt(b.streamRoom.slice(-1), 10)
    ));
    setMatches(convertedGames);
    setFilteredGames(convertedGames);
    setLoading(false);
  }, []);

  /**
   * filters the displayed games by team name
   * @param {string} teamName team name to filter on
   */
  const filterGames = memoize((teamName) => {
    setLoading(true);
    if (matches && matches.length > 1) {
      if (!teamName) {
        setFilteredGames(matches);
        setFilterTeam('');
        setLoading(false);
      } else if (parseInt(teamName, 10) > 0) {
        const tempGames = matches.filter((game) => game.curDivision === teamName);
        setFilteredGames(tempGames);
        setFilterTeam(teamName);
        setLoading(false);
      } else {
        const tempGames = matches.filter((game) => game.homeTeamName === teamName || game.awayTeamName === teamName);
        setFilteredGames(tempGames);
        setFilterTeam(teamName);
        setLoading(false);
      }
    }
  });

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

    // remove the date portion of the date
    const timeOfGame = game.gameTime.split(' ').slice(1,3).join(' ');

    const gsNum = game.streamRoom.slice(-1);
    const gsColor = gsNum === '1' ? '#c62828' : gsNum === '2' ? 'blue' : 'yellow';

    const homeTeam = teams.find((t) => t.id === game.homeTeamId);
    const awayTeam = teams.find((t) => t.id === game.awayTeamId);

    const curGame = (
      <Grid item xs={12} md={4} key={`gameweek-${curWeek}-game-${game.matchNum}row`}>
        <Paper className={classes.gamePaper}>
          <Grid container direction="row">
            <Grid item xs={1}>
              <Grid item style={{ height: '100%' }}>
                <Typography
                  className={`${classes.teamDesc} ${classes.teamRank} ${classes.streamText}`}
                  style={{ textShadow: `0 0 1px ${gsColor}` }}
                >
                  {(game.streamRoom || 'GONGSHOW1').toLowerCase()}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container direction="column" alignItems="center" justify="flex-start">
                <Grid item>
                  <Avatar
                    src={game.curDivision === '2' ? lowerDivLogo : upperDivLogo}
                    variant="square"
                    alt={`Division ${game.curDivision} logo`}
                    className={classes.largeIcon}
                  />
                </Grid>
                <Grid item>
                  <span className={`${classes.teamDesc} ${classes.teamRank}`}>
                    {timeOfGame}
                  </span>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={9} className={classes.scoreSection}>
              <Grid container direction="column" justify="space-around">
                <Grid container direction="row" justify="space-around" alignItems="center">
                  <Avatar
                    src={logoSrc}
                    variant="square"
                    alt={`${game.homeTeamName} logo`}
                    onClick={() => filterGames(game.homeTeamName)}
                    className={classes.linkStyle}
                  />
                  <Grid item xs onClick={() => filterGames(game.homeTeamName)} className={classes.linkStyle}>
                    <span className={`${classes.teamDesc} ${classes.teamRank}`}>
                      {homeTeam ? homeTeam.rank: game.homeTeamRank}
                    </span>
                    <span className={`${classes.teamName} ${game.matchResult === 'L' ? classes.nameLoss : ''}`}>
                      {game.homeTeamName}
                    </span>
                  </Grid>
                  <Grid item xs>
                    {game.games.map((g, idx) => (
                      <span key={`home-score-${g.gameNum}-${idx}`} className={`${g.homeWin ? classes.scoreWin : classes.scoreLoss} ${classes.scoreText}`}>
                        {g.homeTeamScore}
                      </span>
                    ))}
                  </Grid>
                </Grid>
                <Grid container justify="flex-start" alignItems="center">
                  <Avatar
                    src={oppLogoSrc}
                    variant="square"
                    alt={`${game.awayTeamName} logo`}
                    onClick={() => filterGames(game.awayTeamName)}
                    className={classes.linkStyle}
                  />
                  <Grid item xs onClick={() => filterGames(game.awayTeamName)} className={classes.linkStyle}>
                    <span className={`${classes.teamDesc} ${classes.teamRank}`}>
                      {awayTeam ? awayTeam.rank: game.awayTeamRank}
                    </span>
                    <span className={`${classes.teamName} ${game.matchResult === 'W' ? classes.nameLoss : ''}`}>
                      {game.awayTeamName}
                    </span>
                  </Grid>
                  <Grid item xs>
                    {game.games.map((g, idx) => (
                      <span key={`away-score-${g.gameNum}-${idx}`} className={`${!g.homeWin ? classes.scoreWin : classes.scoreLoss} ${classes.scoreText}`}>
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
      <Grid container justify="flex-start" alignItems="flex-end" className={classes.gamesBump}>
        <Grid item xs={12}>
          <Grid container spacing={1} justify="space-between" alignItems="flex-end">
            <Button
              variant="contained"
              color={filterTeam === '' ? 'primary' : 'secondary'}
              disabled={filterTeam === ''}
              onClick={() => filterGames()}
            >
              ALL
            </Button>
            <Button
              variant="contained"
              color={filterTeam === '1' ? 'primary' : 'secondary'}
              disabled={filterTeam === '1'}
              onClick={() => filterGames('1')}
            >
              <Avatar src={images['RLL_logo']} />
            </Button>
            <Button
              variant="contained"
              color={filterTeam === '2' ? 'primary' : 'secondary'}
              disabled={filterTeam === '2'}
              onClick={() => filterGames('2')}
            >
              <Avatar src={images['RLL_logo_lower']} />
            </Button>
            {teams.map((team) => (
              <Button
                variant="contained"
                color={filterTeam === team.name ? 'primary' : 'secondary'}
                disabled={filterTeam === team.name}
                onClick={() => filterGames(team.name)}
              >
                <Avatar src={images[`LOGO_${team.name.replaceAll(' ', '_')}`]} />
                {/* {team.name} */}
              </Button>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {allGames}
          </Grid>
        </Grid>
      </Grid>
    </BaseApp>
  );
}
