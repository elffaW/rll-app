import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
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
    width: `calc(100% - ${theme.spacing(2)}px) !important`,
    margin: theme.spacing(1),
    paddingLeft: theme.spacing(1),
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
  navDrawer: {
    // backgroundColor: theme.palette.primary.dark,
  },
}));

export default function BaseApp(props) {
  const { children } = props;
  
  const [navOpen, setNavOpen] = useState(false);
  
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <React.Fragment key="nav-drawer-left">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setNavOpen(!navOpen)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={navOpen}
              onClose={() => setNavOpen(false)}
              onOpen={() => setNavOpen(true)}
              className={classes.navDrawer}
            >
              <List>
                <ListItem>
                  <ListItemIcon>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={() => setNavOpen(!navOpen)}
                      edge="start"
                    >
                      <MenuIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText>
                    <Avatar src={logo} className={classes.mainLogo} />
                    <Typography variant="h5" className={classes.mainTitle}>
                      RLL
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
              </List>
            </SwipeableDrawer>
          </React.Fragment>
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
