import { useContext, useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from './Contexts/UserContext'
import { LoggedInContext } from './Contexts/LoggedInContext'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Avatar from '@material-ui/core/Avatar';
import UploadButton from './UploadButton'
import axios from 'axios';
import { eraseCookie } from './utils/cookies';

var gravatar = require('gravatar');

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
    height: '150px',
    marginBottom: '-40px',
  },
  radio:{
    color: theme.palette.text.primary,
    marginRight: '50%',
  },
  avatar: {
    width: '100px',
    height: '100px',
    marginRight: '10px'
  },
});

export default ({usernameDur}) => {
  const styles = useStyles(useTheme());
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [avatar, setAvatar] = useState('');
  const contextLoggedIn = useContext(LoggedInContext)
  const contextUser = useContext(UserContext)

  useEffect(() => {
    if(!contextLoggedIn.loggedIn){
      //console.log(contextLoggedIn)
      //window.location.href = '/login' //Not working
    }
    /*const fetchData = async () => {
      const {data: fetchedUser} = await axios.get(`http://localhost:3001/users/${contextUser.username}`,{}, {withCredentials: true}).then(function (response){
        setEmail(fetchedUser.email)
        setGender(fetchedUser.gender)
        setLanguage(fetchedUser.language)
        setName(fetchedUser.name)
        console.log(fetchedUser)
      }).catch(function (error){
          alert('An error occured.')
      })
    }
    fetchData()*/
  }, [contextLoggedIn.loggedIn])

  const handleAvatar = (event) => {
    setAvatar(event.target.value);
  };

  const [values, setValues] = useState({
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

  const [gender, setGender] = useState('');

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleLanguage = (event) => {
    setLanguage(event.target.value)
  }

  const handleUpdate = () => {
    axios.put('http://localhost:3001/users',{
      username: contextUser.username,
      email: email,
      password: password,
      gender: gender,
      language: language,
      avatar: convertAvatar(),
    }, {withCredentials: true}).then(function (response){
      alert("Successfully updated database. You now have to reconnect...")
      eraseCookie("authorization")
      window.location.href = '/';
    }).catch(function (error){
        alert('An error occured.')
    })
  }

  const convertAvatar = () => {
    if(avatar === "gravatar"){
      return gravatar.url(email)
    }
    else if(avatar === "uploaded"){
      return "./avatars/avatar1.png" //Default 1 for the moment
    }
    else{
      return avatar
    }
  }

  return (
    <div css={styles.root} >
      <Grid style={styles.center}>
        <AccountCircleIcon
          color='primary'
          css={styles.icon}
        />
      </Grid>

      <Grid style={styles.center}>
        <Typography variant='h2' color='primary'>
          Account settings
        </Typography>
        <Typography variant='subtitle1' color='error' style={styles.center}>
            WARNING: properties may not all be active.
        </Typography>
        <Typography variant='subtitle1' color='error' style={styles.center}>
            Database will however really update with these values.
        </Typography>
      </Grid>

      <Grid>
        <TextField
          variant="outlined"
          label="Name (not username)"
          autoFocus
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>

      <Grid>
        <TextField
          variant="outlined"
          type="email"
          label="Email"
          fullWidth
          value={email}
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
        <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup aria-label="Gender" value={gender} onChange={handleGender} css={styles.radio} row >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
        </FormControl>
      </Grid>

      <Grid>
      <FormControl fullWidth>
        <InputLabel >Prefered Language</InputLabel>
        <Select
          value={language}
          onChange={handleLanguage}
        >
          <MenuItem value={"English"}>English</MenuItem>
          <MenuItem value={"French"}>French</MenuItem>
          <MenuItem value={"Spanish"}>Spanish</MenuItem>
          <MenuItem value={"Italian"}>Italian</MenuItem>
          <MenuItem value={"Deutch"}>Deutch</MenuItem>
        </Select>
      </FormControl>
      </Grid>

      <Grid>
        <FormControl component="fieldset">
            <FormLabel component="legend">Choose an avatar</FormLabel>
            <RadioGroup aria-label="Gender" value={avatar} onChange={handleAvatar} css={styles.radio} row>
              <Avatar alt="Avatar 1" src="https://pickaface.net/gallery/avatar/unr_sample_170130_2257_9qgawp.png" css={styles.avatar} />
              <FormControlLabel value="https://pickaface.net/gallery/avatar/unr_sample_170130_2257_9qgawp.png" control={<Radio />} label="Default 1" />
              <Avatar alt="Avatar 2" src="https://www.nicepng.com/png/full/186-1866063_dicks-out-for-harambe-sample-avatar.png" css={styles.avatar} />
              <FormControlLabel value="https://www.nicepng.com/png/full/186-1866063_dicks-out-for-harambe-sample-avatar.png" control={<Radio />} label="Default 2" />
              <Avatar alt="Avatar 3" src="https://pickaface.net/gallery/avatar/pk_karthik556366573d429.png" css={styles.avatar} />
              <FormControlLabel value="https://pickaface.net/gallery/avatar/pk_karthik556366573d429.png" control={<Radio />} label="Default 3" />
              <Avatar alt="Avatar 4" src="https://pickaface.net/gallery/avatar/unr_sample_170124_2254_7ihbitjq.png" css={styles.avatar} />
              <FormControlLabel value="https://pickaface.net/gallery/avatar/unr_sample_170124_2254_7ihbitjq.png" control={<Radio />} label="Default 4"/>
              <FormControlLabel value="gravatar" control={<Radio />} label="Use my gravatar image"/>
              <FormControlLabel value="uploaded" control={<UploadButton />} label=" Upload my image"/>
            </RadioGroup>
        </FormControl>
      </Grid>
        
      <Grid>
        <Button
          type="submit"
          margin = 'normal'
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
        >
          Update
        </Button>
      </Grid>

    </div>
  );
}
