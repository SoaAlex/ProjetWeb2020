import React, { useState } from 'react';
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
});

export default ({
  onUser
}) => {
  const [userAlreadyExist, setUserAlreadyExist] = useState(false);
  const [email, setEmail] = useState(null)
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

  const handleRegister = () => {
    axios.post('http://localhost:3001/users/register',{
        username: username,
        email: email,
        password: password,
    }, {withCredentials: true}).then(function (response){
      console.log(response)
      console.log("Redirecting to login...")
      onUser(username)
      window.location.href = '/login';
    }).catch(function (error){
      if(error.response.status === 409){
        console.log("User already exists...")
        setUserAlreadyExist(true);
      }
    })
  }

  const styles = useStyles(useTheme());

  return (
    <div css={styles.root} >
      <Grid style={styles.center}>
        <img src={require("./icons/LogoECE.png")} alt='WhatsECE Logo'></img>
      </Grid>

      <Grid style={styles.center}>
        <Typography variant='h2' color='primary'>
          Create an account
        </Typography>
      </Grid>

      <Grid>
        <TextField
          error= {userAlreadyExist}
          variant="outlined"
          id="username"
          label="Username"
          name="username"
          autoFocus
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          helperText={userAlreadyExist ? "User already exists. Please try another username" : ""}
        />
      </Grid>

      <Grid>
        <TextField
          variant="outlined"
          id="email"
          label="E-mail"
          name="E-mail"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>

      <Grid>
        <FormControl css = {styles.password} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
          <OutlinedInput
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
        </FormControl>
      </Grid>
        
      <Grid>
        <Button
          type="submit"
          margin = 'normal'
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Register
        </Button>
      </Grid>

    </div>
  );
}
