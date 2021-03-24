import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Avatar, Paper, CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import BaseApp from './BaseApp';

import * as images from '../images';

const useStyles = makeStyles((theme) => ({
  gamePaper: {
    backgroundColor: theme.otherColors.background.mainDarker,
  },
  paper: {
    // padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: `${theme.palette.primary.light}A0`, // add transparency
    width: '100%',
  },
  linkStyle: {
    cursor: 'pointer',
  },
  teamName: {
    fontVariant: 'small-caps',
    marginLeft: theme.spacing(1),
    color: 'whitesmoke',
    fontWeight: 500,
    textShadow: '1px 1px 1px black',
  },
  teamDesc: {
    fontSize: '1.1rem',
    fontVariant: 'small-caps',
    marginLeft: theme.spacing(1),
    color: 'whitesmoke',
    fontWeight: 500,
    textShadow: '1px 1px 1px black',
  },
  statLabel: {
    fontVariant: 'small-caps',
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.darkest,
    fontWeight: 500,
    // textShadow: '1px 1px 1px whitesmoke',
  },
  teamRank: {
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'whitesmoke',
    textShadow: '1px 1px 2px black',
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  playerName: {
    fontVariant: 'small-caps',
    marginLeft: theme.spacing(1),
    color: 'whitesmoke',
    fontWeight: 700,
    textShadow: '1px 1px 1px black',
  },
  largeIcon: {
    width: theme.spacing(7.5),
    height: theme.spacing(7.5),
  },
}));

export default function Teams(props) {
  const { players, teams } = props;
  
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teams.sort((a, b) => a.rank - b.rank); // sort with lower rank at top
    
    setLoading(false);
  }, [teams]);

  if (loading) {
    return (
      <BaseApp>
        <span style={{ left: '50%', position: 'relative' }}>
          <CircularProgress color="secondary" />
        </span>
      </BaseApp>
    );
  }

  const d1Teams = [];
  const d2Teams = [];
  teams.forEach((team) => {
    const logoSrc = images[`LOGO_${team.name.replaceAll(' ', '_')}`];

    let teamComponent = (
      <Grid item xs={12} key={`team-${team.name}-row`} spacing={2}>
        <Paper className={classes.paper}>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={2} md={1}>
              <Avatar
                src={logoSrc}
                variant="square"
                alt={`Team ${team.name} logo`}
                className={classes.largeIcon}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Grid container>
                <Typography variant="h6" className={classes.teamRank}>
                  {team.rank}
                </Typography>
                <Typography variant="h5" className={classes.teamName}>
                  {team.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={2} md={1}>
              <Typography variant="h6" className={classes.teamDesc}>
                {`${team.wins} - ${team.losses}`}
              </Typography>
            </Grid>
            <Grid item xs={2} md={1}>
              <Typography variant="h6" className={classes.teamDesc}>
                {team.value}
              </Typography>
            </Grid>
            <Grid item xs={2} md={1}>
              <Grid container>
                <Typography variant="body1" className={classes.statLabel}>
                  +/-:
                </Typography>
                <Typography variant="h6" className={classes.teamDesc}>
                  {team.plusMinus}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container justify="space-around" alignItems="center">
                {team.members.map((p) => (
                  <Grid item>
                    <Typography variant="body1" className={classes.playerName}>
                      {players ? players.find((plyr) => plyr.id === p)?.name : p}
                    </Typography>
                    {players && (
                      <Typography variant="body1" className={classes.statLabel}>
                        {`$${players.find((plyr) => plyr.id === p)?.value} M`}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
    
    if (parseInt(team.curDivision, 10) === 2) {
      d2Teams.push(teamComponent);
    } else {
      d1Teams.push(teamComponent);
    }
  });

  return (
    <BaseApp>
      <Grid container spacing={1} justify="flex-start" alignItems="center" className={`${classes.gamesBump} game-with-division-1`}>
        {d1Teams}
      </Grid>
      <br /><br />
      <Grid container spacing={1} justify="flex-start" alignItems="center" className={`${classes.gamesBump} game-with-division-2`}>
        {d2Teams}
      </Grid>
    </BaseApp>
  );
}
