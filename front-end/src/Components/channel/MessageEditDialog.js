import React, { useState } from 'react';
import axios from 'axios';
// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// HIGHLY INSPIRED FRO MUI DOCUMENTATION: https://material-ui.com/components/dialogs/
export default ({
  open,
  setOpen,
  refreshMessages,
  channelId,
  message,
  creation,
}) => {
  const [newContent, setNewContent] = useState("")

  const handleNewContent = (e) => {
    setNewContent(e.currentTarget.value)
  }

  const handleCloseEdit = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    axios.put(`http://localhost:3001/channels/${channelId}/messages/${creation}`, {
      author: message.author,
      content: newContent
    }, {withCredentials: true}).then(function (response){
      refreshMessages()
      handleCloseEdit()
      setNewContent("")
    }).catch(function (error){
      alert("An unattended error occured. One more bug.")
    })
  }

  return(
      <Dialog open={open} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
      <DialogTitle >Edit your message</DialogTitle>
      <DialogContent>
      <TextField
          autoFocus
          margin="dense"
          fullWidth
          value={newContent}
          onChange={handleNewContent}
      />
      </DialogContent>
      <DialogActions>
      <Button onClick={handleCloseEdit} color="primary">
          Cancel
      </Button>
      <Button onClick={handleEdit} color="primary">
          Edit
      </Button>
      </DialogActions>
      </Dialog>
  )
} 