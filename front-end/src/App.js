import {useState} from 'react'
import './App.css';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Local
import Footer from './Footer'
import Header from './Header'
import Main from './Main'
import Login from './Login'
import { ChannelsContext } from './Contexts/ChannelsContext'
import { UserContext } from './Contexts/UserContext';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

//Add authorization to every headers
axios.interceptors.request.use(req => {
  req.headers.authorization = getCookie('authorization')
  return req;
});


export default () => {
  //VARIABLES & HOOKS
  const styles = useStyles();
  const [user, setUser] = useState(null)
  const [channels, setChannels] = useState([{id: 0, name: 'channel 0'}]);
  const [drawerMobileVisible, setDrawerMobileVisible] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const darkModeToggleListener = () => {
    setDarkMode(!darkMode)
  }
  const drawerToggleListener = () => {
    setDrawerMobileVisible(!drawerMobileVisible)
  }

  const contextChannels = {
    channels: channels,
    setChannelsContext: setChannels
  }
  const contextUser = {
    user: user,
    setUserContext: setUser
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
    <ChannelsContext.Provider value={contextChannels}>
    <CssBaseline />
      <div className={styles.root}>
        <Header 
          drawerToggleListener={drawerToggleListener}
          darkModeToggleListener = {darkModeToggleListener}
        />
        {
          user ? <Main drawerMobileVisible={drawerMobileVisible} /> : <Login onUser={setUser} />
        }
        <Footer />
      </div>
    </ChannelsContext.Provider>
    </UserContext.Provider>
    </ThemeProvider>
  );
}