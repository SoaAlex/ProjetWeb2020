import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import {useContext} from 'react'
// HIGHLY INSPIRED FROM MUI DOCS: https://material-ui.com/components/app-bar/

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import NightsStayRoundedIcon from '@material-ui/icons/NightsStayRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { eraseCookie } from './utils/cookies';
import { LoggedInContext } from './Contexts/LoggedInContext';
import { UserContext } from './Contexts/UserContext';
import {ReactComponent as ECEIcon} from './icons/LogoECE.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    color: '#ffffff'
  },
  img:{
    maxWidth: '40px',
    marginRight: '10px',
    marginLeft:'-15px',
    flexGrow: 1,
    height: '40px',
    fill: theme.palette.secondary.main 
  },
  menu: {
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
    marginRight: theme.spacing(2),
  },
  darkModeSwitch:{
    marginRight: '-5px',
    //marginLeft: '-5px'
  },
  accountButton:{
    backgroundColor: theme.palette.primary.dark
  },
  logout:{
    color: theme.palette.error.main
  }
}));

export default ({
  drawerToggleListener,
  darkModeToggleListener,
}) => {
  const contextUser = useContext(UserContext)
  const contextLoggedIn = useContext(LoggedInContext)

  const styles = useStyles();
  const handleDrawerToggle = (e) => {
    drawerToggleListener()
  }
  const handleDarkModeToggle = (e) => {
    darkModeToggleListener()
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    console.log(contextUser.username)
    console.log(contextLoggedIn.loggedIn)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    handleClose()
    eraseCookie("authorization")
    window.location.href = '/';
  }

  const handleManageAccount = () => {
    handleClose()
    window.location.href = '/account';
  }

  const handleRedirectHome = () => {
    window.location.href = '/welcome';
  }

  return (
    <header className={styles.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
           edge="start" 
            className={styles.menu} 
            color="inherit" 
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <IconButton onClick={handleRedirectHome}>
            <ECEIcon className ={styles.img} />
            <Typography variant="h5" className={styles.title}>
              WhatsECE
            </Typography>
          </IconButton>
          <Typography variant="h5" className={styles.title}></Typography> 

          <IconButton aria-label="darkMode">
            <FormControlLabel
              control={
                <Switch
                  name="darkModeSwitch"
                  color="secondary"
                  onClick = {handleDarkModeToggle}
                />
              }
              className={styles.darkModeSwitch}
              //label="Dark Mode (BETA)"
            />
            <NightsStayRoundedIcon/>
          </IconButton>
          { contextLoggedIn.loggedIn ?
          <Button
            variant="contained"
            color="secondary"
            className={styles.accountButton}
            onClick={handleClick}
            endIcon={<AccountCircleRoundedIcon></AccountCircleRoundedIcon>}
          >
            { contextUser.username }
          </Button> : ""
          }
          { contextLoggedIn.loggedIn ?
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleManageAccount}>Manage account</MenuItem>
            <MenuItem onClick={handleLogOut} className={styles.logout}>Logout</MenuItem>
          </Menu> : ""
          }
        </Toolbar>
      </AppBar>
    </header>
  );
}