import React from 'react';
import {
  AppBar, Avatar, Box, Container, Toolbar, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { NavLink, useLocation } from 'react-router-dom';

// import NotFound from './NotFound';
// import { lookupTabNumByPath } from '../utils/tabHelper';

import logo from '../images/RLL_logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  mainContent: {
    // hide scrollbars but still allow scrolling
    overflow: 'scroll',
    scrollbarWidth: 'none', /* Firefox */
    '&::-webkit-scrollbar': { /* WebKit */
      width: 0,
      height: 0,
    },
  },
  contentContainer: {
    position: 'absolute',
    top: 48,
    width: `calc(100% - ${theme.spacing(4)}px) !important`,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  mainLogo: {
    marginLeft: -theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  mainTitle: {
    fontFamily: 'Oswald',
    textShadow: '1px 1px 2px black',
    marginTop: -theme.spacing(0.5),
  },
}));

export default function BaseApp(props) {
  const { children } = props;
  
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Avatar src={logo} className={classes.mainLogo} />
          <Typography variant="h4" className={classes.mainTitle}>
            Rocket League League
          </Typography>
        </Toolbar>
      </AppBar>
      <Box id="main-content" bgcolor="primary.main" className={classes.mainContent}>
        <Container className={classes.contentContainer} maxWidth={false}>
          {children}
        </Container>
      </Box>
    </div>
  );
}
