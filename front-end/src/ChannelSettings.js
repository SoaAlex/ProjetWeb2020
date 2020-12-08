import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

// HIGHLY INSPIRED FROM MATERIAL UI DOCUMENTATION: https://material-ui.com/components/dialogs/
export default (props) => {
    const classes = useStyles();
    const { onClose, channel, open } = props;
  
    const handleClose = () => {
      onClose()
    };
  
    const handleDelete = (user) => {
      //update channel content
      let updatedChannel = channel
      updatedChannel.users.splice(channel.users.indexOf(user),1)
      delete updatedChannel.id

      axios.post('http://localhost:3001/users/login',updatedChannel, {withCredentials: true}).then(function (response){
        onClose();
        console.log("Redirecting to welcome...")
        window.location.href = '/welcome';
      }).catch(function (error){
        alert("An unattended error occured. One more bug.")
      })
    };

    const handleAdd = async () => {
      //await axios.
      onClose();
    };
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="settings" open={open}>
        <DialogTitle id="title">Manage users</DialogTitle>
        <List>
          {channel.users.map((user) => (
            <ListItem button onClick={() => handleDelete(user)} key={user}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}> {/*TODO Add real avatars*/}
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <DeleteForeverIcon color="error"/>
              <ListItemText primary={user} />
            </ListItem>
          ))}
  
          <ListItem autoFocus button onClick={() => handleAdd()}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add user to channel" />
          </ListItem>
        </List>
        <Button color="primary" variant="outlined" onClick={handleClose}>EXIT</Button>
      </Dialog>
    );
}