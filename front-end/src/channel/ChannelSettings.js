import React, {useEffect, useState} from 'react';
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
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

// HIGHLY INSPIRED FROM MATERIAL UI DOCUMENTATION: https://material-ui.com/components/dialogs/
export default ({channel, onClose, open}) => {
  const classes = useStyles();
  const [addedUser, setAddedUser] = useState("")
  const [channelRefreshed, setChannelRefreshed] = useState(channel)

  useEffect( () => {
    const fetch = async () => {
      const {data: channelCopy} = await axios.get(`http://localhost:3001/channels/${channel.id}`)
      setChannelRefreshed(channelCopy)
    }
    fetch()
  }, [channel])

  const refreshChannel = async () => {
    const {data: channelCopy} = await axios.get(`http://localhost:3001/channels/${channel.id}`)
    setChannelRefreshed(channelCopy)
  }

  const handleClose = () => {
    onClose()
  };

  const handleDelete = (user) => {
    //update channel content
    var updatedChannel = JSON.parse(JSON.stringify(channelRefreshed));
    updatedChannel.users.splice(channelRefreshed.users.indexOf(user),1)
    delete updatedChannel.id

    axios.put(`http://localhost:3001/channels/${channelRefreshed.id}`, updatedChannel, {withCredentials: true}).then(function (response){
      refreshChannel()
      setAddedUser("")
      onClose();
    }).catch(function (error){
      alert("An unattended error occured. One more bug.")
    })
  };

  const handleAdd = async () => {
    var updatedChannel = JSON.parse(JSON.stringify(channelRefreshed));
    updatedChannel.users.push(addedUser)
    delete updatedChannel.id

    axios.put(`http://localhost:3001/channels/${channelRefreshed.id}`, updatedChannel, {withCredentials: true}).then(function (response){
      refreshChannel()
      setAddedUser("")
      onClose();
    }).catch(function (error){
      alert("An unattended error occured. One more bug.")
    })
  };

  const handleAddSet = e => {
    setAddedUser(e.target.value)
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="settings" open={open}>
      <DialogTitle id="title">Manage users</DialogTitle>
      <List>
        {channelRefreshed.users.map((user) => (
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

        <ListItem autoFocus button >
          <ListItemAvatar onClick={() => handleAdd()}>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField value={addedUser} label="Add user to channel" placeholder="Press '+' to add" onChange={handleAddSet} />
            </form>
        </ListItem>
      </List>
      <Button color="primary" onClick={handleClose}>Press ESC to abort</Button>
    </Dialog>
  );
}