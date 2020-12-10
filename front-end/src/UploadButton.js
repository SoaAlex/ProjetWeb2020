import React from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

//INSPIRED FROM https://material-ui.com/components/buttons/

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  button:{
    marginRight: '5px',
    marginLeft: '10px',
  }
}));

export default () => {
  const styles = useStyles();

    return(
      <div>
        <input
          accept="image/*"
          className={styles.input}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" className={styles.button} disabled /* disabled while feature not implemented */>
            Upload
          </Button>
        </label>
      </div>
    )
}