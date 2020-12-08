import React, {useContext , useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import { FormHelperText } from '@material-ui/core';
import { UserContext } from './Contexts/UserContext';

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

  register:{
    marginTop: '10px',
    textAlign: 'center',
    marginBottom: '-15px',
  }
});

export default () => {
  const contextUser = useContext(UserContext)

  const [wrongPass, setWrongPass] = useState(false);
  const [wrongUser, setWrongUser] = useState(false);
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)


  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogIn = async () => {
    await axios.post('http://localhost:3001/users/login',{
        username: username,
        password: password
    }, {withCredentials: true}).then(function (response){
      setWrongUser(false);
      setWrongPass(false);
      console.log("Redirecting to welcome...")
      contextUser.setUserContext(username) //Not working for some reason
      window.location.href = '/welcome';
    }).catch(function (error){
      if(error.response.status === 404){
        console.log("Wrong username...")
        setWrongPass(false);
        setWrongUser(true);
      }
      else if(error.response.status === 401){
        console.log("Wrong password...")
        setWrongPass(true);
        setWrongUser(false);
      }
    })
  }

  const handleRegister = () => {
    window.location.href = '/register';
  }

  const styles = useStyles(useTheme());

  return (
    <div css={styles.root} >
      <Grid style={styles.center}>
        <img src={require("./icons/LogoECE.png")} alt='WhatsECE Logo'></img>
      </Grid>

      <Grid style={styles.center}>
        <Typography variant='h2' color='primary'>
          WhatsECE
        </Typography>
      </Grid>

      <Grid>
        <TextField
          error= {wrongUser}
          variant="outlined"
          id="username"
          label="Username"
          name="username"
          autoFocus
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          helperText={wrongUser ? "Incorrect Username" : ""}
        />
      </Grid>

      <Grid>
        <FormControl css = {styles.password} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
          <OutlinedInput
            error={wrongPass}
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  required
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
          {wrongPass ? <FormHelperText id="component-error-text" error>Incorrect password</FormHelperText> : ""}
        </FormControl>
      </Grid>
        
      <Grid>
        <Button
          type="submit"
          margin = 'normal'
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogIn}
        >
          Log in
        </Button>
      </Grid>

      <Grid>
        <Typography variant='h6' color='primary' css={styles.register}>
          Do not have an account yet ?
        </Typography>
      </Grid>

      <Grid>
        <Button
          margin = 'normal'
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Sign in
        </Button>
      </Grid>

    </div>
  );
}
