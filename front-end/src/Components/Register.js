/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useState } from 'react';
import axios from 'axios';
// MUI
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Avatar from '@material-ui/core/Avatar';
import UploadButton from './UploadButton'
import { FormHelperText } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Gravatar library
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
  radio:{
    color: theme.palette.text.primary,
  },
  ece: {
    width: 'auto',
    marginBottom: '-10px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    float: 'left',
    marginTop:'5px',
  },
});

export default () => {
  const [userAlreadyExist, setUserAlreadyExist] = useState(false);
  const [missingEmail, setMissingEmail] = useState(false)
  const [missingPassword, setMissingPassword] = useState(false)
  const [missingName, setMissingName] = useState(false)
  const [missingLanguage, setMissingLanguage] = useState(false)
  const [missingGender, setMissingGender] = useState(false)
  const [missingAvatar, setMissingAvatar] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageFile, setImageFile] = useState(null)

  const handleFileSelected = (event) => {
    setImageFile(event.target.files[0])
    setAvatar("uploaded")
  }

  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleAvatar = (event) => {
    setAvatar(event.target.value);
  };

  const handleLanguage = (event) => {
    setLanguage(event.target.value)
  }

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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const convertAvatar = () => {
    if(avatar === "gravatar"){
      return gravatar.url(email)
    }
    else if(avatar === "uploaded"){
      return `http://localhost:3001/avatar/${imageFile.name}`
    }
    else{
      return avatar
    }
  }

  const handleRegister = () => {
    setUserAlreadyExist(false)
    setMissingAvatar(false)
    setMissingEmail(false)
    setMissingGender(false)
    setMissingLanguage(false)
    setMissingName(false)
    setMissingPassword(false)

    if(email !== "" && username !== "" && password !== "" && name !== "" && language !== "" && gender !== "" && avatar !== ""){
      //Handle image upload
      const fd = new FormData()
      if(avatar === "uploaded" && imageFile !== null){
        fd.append('file', imageFile)
        axios.post('http://localhost:3001/upload-avatar', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true}
          ).catch(function (err){
          alert("There was an error while uploading the file.")
        })
      }
      
      axios.post('http://localhost:3001/users/register',{
        username: username,
        email: email,
        password: password,
        gender,
        language: language,
        name: name,
        avatar: convertAvatar()
      }, {withCredentials: true}).then(function (response){
        console.log("Redirecting to login...")
        window.location.href = '/login';
      }).catch(function (error){
        console.log(error)
        if(error.response.status === 409){
          console.log("User already exists...")
          setUserAlreadyExist(true);
        }
      })
    }
    else{
      handleClickOpen()
    }
    if(username === ""){
      setUserAlreadyExist(true)
    }
    if(email === ""){
      setMissingEmail(true)
    }
    if(avatar === ""){
      setMissingAvatar(true)
    }
    if(password === ""){
      setMissingPassword(true)
    }
    if(name === ""){
      setMissingName(true)
    }
    if(language === ""){
      setMissingLanguage(true)
    }
    if(gender === ""){
      setMissingGender(true)
    }
  }

  const styles = useStyles(useTheme());

  return (
    <div css={styles.root} >

      <Grid style={styles.ece}>
        <img src={require("../icons/LogoECE.png")} alt='WhatsECE Logo' ></img>
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
          required
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          helperText={userAlreadyExist ? "Username empty or user already exists. Please try another username" : ""}
        />
      </Grid>

      <Grid>
        <TextField
          error={missingEmail}
          variant="outlined"
          id="email"
          label="E-mail"
          name="E-mail"
          fullWidth
          required
          onChange={(e) => setEmail(e.target.value)}
          helperText={missingEmail ? "Mail can't be empty" : ""}
        />
      </Grid>

      <Grid>
        <TextField
          error={missingName}
          variant="outlined"
          label="Name (not username)"
          autoFocus
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText={missingName ? "Name can't be empty" : ""}
        />
      </Grid>

      <Grid>
        <FormControl css = {styles.password} variant="outlined">
          <InputLabel required htmlFor="outlined-adornment-password" >Password</InputLabel>
          <OutlinedInput
            error={missingPassword}
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
          {missingPassword ? <FormHelperText id="component-error-text" error>Password can't be empty</FormHelperText> : ""}
        </FormControl>
      </Grid>

      <Grid>
        <FormControl error={missingGender} component="fieldset">
            <FormLabel required component="legend" >Gender</FormLabel>
            <RadioGroup aria-label="Gender" value={gender} onChange={handleGender} css={styles.radio} row>
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
        </FormControl>
      </Grid>

      <Grid>
      <FormControl css={{marginTop:"-25px"}} fullWidth>
        <InputLabel required error={missingLanguage}>Prefered Language</InputLabel>
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
        <FormControl error={missingAvatar} component="fieldset">
            <FormLabel required component="legend" css={{marginBottom:"10px"}}>Choose an avatar</FormLabel>
            <RadioGroup aria-label="Gender" value={avatar} onChange={handleAvatar} css={styles.radio} >
            <Grid container justify="flex-start" alignItems="flex-start">
              <Grid item xs={12}>
                <Avatar alt="Avatar 1" src="https://pickaface.net/gallery/avatar/unr_sample_170130_2257_9qgawp.png" css={styles.avatar} />
                <FormControlLabel value="https://pickaface.net/gallery/avatar/unr_sample_170130_2257_9qgawp.png" css={{position: 'absolute', top:'11%', marginLeft:'1%'}} control={<Radio />} label="Woman 1" />
              </Grid>
              <Grid item xs={12}>
                <Avatar alt="Avatar 2" src="https://www.nicepng.com/png/full/186-1866063_dicks-out-for-harambe-sample-avatar.png" css={styles.avatar} />
                <FormControlLabel value="https://www.nicepng.com/png/full/186-1866063_dicks-out-for-harambe-sample-avatar.png" css={{position: 'absolute', top:'30%', marginLeft:'1%'}} control={<Radio />} label="Man 2" />
              </Grid>
              <Grid item xs={12}>
                <Avatar alt="Avatar 3" src="https://pickaface.net/gallery/avatar/pk_karthik556366573d429.png" css={styles.avatar} />
                <FormControlLabel value="https://pickaface.net/gallery/avatar/pk_karthik556366573d429.png" css={{position: 'absolute', top:'50%', marginLeft:'1%'}} control={<Radio />} label="Man 3" />
              </Grid>
              <Grid item xs={12}>
                <Avatar alt="Avatar 4" src="https://pickaface.net/gallery/avatar/unr_sample_170124_2254_7ihbitjq.png" css={styles.avatar} />
                <FormControlLabel value="https://pickaface.net/gallery/avatar/unr_sample_170124_2254_7ihbitjq.png" css={{position: 'absolute', top:'70%', marginLeft:'1%'}} control={<Radio />} label="Woman 4"/>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel value="gravatar" control={<Radio />} label="Use my gravatar image"/>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel css={{float:'left'}} value="uploaded" control={<Radio />} label=""/>
                <UploadButton handleFile={handleFileSelected}/>
              </Grid>
            </Grid>
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
          onClick={handleRegister}
        >
          Register
        </Button>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"WARNING"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please complete ALL required fields.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Okay, sorry
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
