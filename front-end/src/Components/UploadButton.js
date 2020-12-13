import React from 'react'
// MUI
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

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
    marginLeft: '-15px'
  }
}));

export default ({
  handleFile
}) => {
  const styles = useStyles();

    return(
      <div>
        <input
          accept="image/*"
          className={styles.input}
          id="contained-button-file"
          multiple
          onChange={handleFile}
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button 
            variant="contained" 
            color="primary" 
            component="span" 
            className={styles.button}
            endIcon={<PhotoLibraryIcon/>}
          >
            Upload
          </Button>
        </label>
      </div>
    )
}