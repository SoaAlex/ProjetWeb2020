import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'

// HIGHLY INSPIRED FROM MUI DOCS: https://material-ui.com/components/app-bar/

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import {ReactComponent as ECEIcon} from './icons/LogoECE.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    //flexGrow: 1,
  },
  title: {
    flexGrow: 1,
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
  }
}));

//<img src={require("./icons/LogoECE.png")} alt='WhatsECE Logo' className={styles.img} />
export default ({
  drawerToggleListener,
  darkModeToggleListener
}) => {
  const styles = useStyles();
  const handleDrawerToggle = (e) => {
    drawerToggleListener()
  }
  const handleDarkModeToggle = (e) => {
    darkModeToggleListener()
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
          <ECEIcon className ={styles.img}/>
          <Typography variant="h5" className={styles.title}>
            WhatsECE
          </Typography>
          <FormControlLabel
            control={
              <Switch
                name="darkModeSwitch"
                color="secondary"
                onClick = {handleDarkModeToggle}
              />
            }
            label="Dark Mode (BETA)"
          />
        </Toolbar>
      </AppBar>
    </header>
  );
}