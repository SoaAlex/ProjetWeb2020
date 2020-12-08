import { useContext, useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ForumIcon from '@material-ui/icons/Forum';
import { UserContext } from './Contexts/UserContext'
import axios from 'axios';

/** INSPIRED FROM MUI DOCS https://material-ui.com/components/text-fields/ */

const useStyles = (theme) => ({
  root: {
    flex: '1 1 auto',
    background: theme.palette.background,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > div': {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '1%',
      marginBottom: '1%',
      width: '30%',
    },
  },
  password:{
    width:'100%'
  },
  center:{
    width: 'auto',
  },
  icon:{
    width: '100%',
    height: '150px'
  }
});

export default () => {
  const [name, setName] = useState(null)
  const [users, setUsers] = useState(null)
  const [userNotFound, setUserNotFound] = useState(false)
  const contextUser = useContext(UserContext)

  const styles = useStyles(useTheme());

  const handleCreateChannel = async () => {
    //First check if all users exists
    let userUnknown = false;
    let array = users.split(';')

    for(const elem of array){
      await axios.get(`http://localhost:3001/users/${elem}`,{}, {withCredentials: true})
      .then(function (response){
        // eslint-disable-next-line
      }).catch(function (error){
        if(error.response.status === 404){
          userUnknown = true
        }
      })
    }

    //Then add yourself
    array.push(contextUser.username)

    //And finally add to db if all users are known
    if(!userUnknown){
      await axios.post('http://localhost:3001/channels',{
        name: name,
        users: array
      }, {withCredentials: true}).then(function (response){
        window.location.href = '/welcome';
      }).catch(function (error){
        if(error.response.status === 404){
        }
        else if(error.response.status === 401){
        }
      })
    }
    else{
      setUserNotFound(true)
    }
  }

  return (
    <div css={styles.root} >
      <Grid style={styles.center}>
        <ForumIcon
          color='primary'
          css={styles.icon}
        />
      </Grid>

      <Grid style={styles.center}>
        <Typography variant='h2' color='primary'>
          Create a channel
        </Typography>
      </Grid>

      <Grid>
        <TextField
          variant="outlined"
          id="name"
          label="Channel name"
          name="name"
          autoFocus
          fullWidth
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>

      <Grid>
        <TextField
          error = {userNotFound}
          variant="outlined"
          id="users"
          label="Users (separated by a coma ) | BETA"
          name="Users"
          fullWidth
          helperText = {userNotFound ? "At least one user does not exist." : "Do not include yourself (automatically added)."}
          onChange={(e) => setUsers(e.target.value)}
        />
      </Grid>
        
      <Grid>
        <Button
          type="submit"
          margin = 'normal'
          variant="contained"
          color="primary"
          fullWidth
          onClick = {handleCreateChannel}
        >
          Create
        </Button>
      </Grid>

    </div>
  );
}
