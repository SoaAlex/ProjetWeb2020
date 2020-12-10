import './App.css';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.secondary.light,
  },
  typography:{
    //flex: '1 1 auto',
    textAlign: 'center',
    margin: '2px'
  }
}));

export default () => {
  const styles = useStyles();

  return (
    <footer className={styles.footer}>
      <Typography variant='subtitle1' className={styles.typography} component='div'>
        ECE Copyright 2020-2021 © | Alexandre SOARES - Paul CAUDAL | <a href="https://www.ece.fr">Contact us</a>
      </Typography>
    </footer>
  );
}
