import {useEffect, useState} from 'react'
import './App.css';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Local
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import Register from './Register'
import CreateChannel from './CreateChannel'
import { ChannelsContext } from './Contexts/ChannelsContext'
import { UserContext } from './Contexts/UserContext';
import { LoggedInContext } from './Contexts/LoggedInContext';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { getCookie } from './utils/cookies';
import jwt from './utils/jwt.utils'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background,
    //padding: '50px',
    color: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
}));


//Add authorization to every headers
axios.interceptors.request.use(req => {
  req.headers.authorization = getCookie('authorization')
  return req;
});


export default () => {
  //VARIABLES & HOOKS
  const styles = useStyles();
  const [username, setUsername] = useState("My Account")
  const [channels, setChannels] = useState([{id: 0, name: 'channel 0'}]);
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect( () => {
    const checkLoggedIn = async () => {
      if(typeof getCookie('authorization') === "undefined"){
        setLoggedIn(false);
        console.log("Not logged in")
      }else{
        setLoggedIn(true);
        setUsername(jwt.verifyToken(getCookie('authorization')).username)
        console.log("Logged in. Redirecting...")
      }
    }
    checkLoggedIn()
  }, [loggedIn])

  const darkModeToggleListener = () => {
    setDarkMode(!darkMode)
    console.log(username)
  }
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible)
  }

  const contextLoggedIn = {
    loggedIn: loggedIn,
    setLoggedInContext: setLoggedIn
  }

  const contextChannels = {
    channels: channels,
    setChannelsContext: setChannels
  }
  const contextUser = {
    username: username,
    setUserContext: setUsername
  }

  //PALETTE
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary:{
        main: '#0277bd',
        light: '#58a5f0',
        dark: '#004c8c',
      },
      secondary:{
        main: '#212121',
        light: '#484848',
        dark: '#000000',
      },
    }
  });

  //RENDER
  return (
    <ThemeProvider theme={theme}>
    <UserContext.Provider value={contextUser}>
    <LoggedInContext.Provider value={contextLoggedIn}>
    <ChannelsContext.Provider value={contextChannels}>
    <CssBaseline />
      <Router>
        <div className={styles.root}>
          <Header 
            drawerToggleListener={drawerToggleListener}
            darkModeToggleListener = {darkModeToggleListener}
          />

          <Switch>
            <Route path="/login">
              {loggedIn ? <Redirect to="/welcome"/> : <Login onUser={setUsername}/>}
            </Route>
            <Route path="/register">
              {loggedIn ? <Redirect to="/welcome"/> : <Register/>}
            </Route>
            <Route path="/welcome">
              {loggedIn ? <Main drawerMobileVisible={drawerMobileVisible} /> : <Redirect to="/login"/>}
            </Route>
            <Route path="/createChannel">
              {/*loggedIn ? <CreateChannel/> : <Redirect to="/login"/>*/}
              <CreateChannel/>
            </Route>
            <Route path="/"> 
              <Redirect to="/login" />
            </Route>
          </Switch>

          <Footer />
        </div>
      </Router>
    </ChannelsContext.Provider>
    </LoggedInContext.Provider>
    </UserContext.Provider>
    </ThemeProvider>
  );
}