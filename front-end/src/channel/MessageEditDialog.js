import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

// HIGHLY INSPIRED FRO MUI DOCUMENTATION: https://material-ui.com/components/dialogs/
export default ({
  open,
  setOpen,
  refreshMessages,
  channelId,
  message,
  creation,
}) => {
  //const [message, setNewMessage] = useState("")
  const [newContent, setNewContent] = useState("")

  const handleNewContent = (e) => {
    setNewContent(e.currentTarget.value)
  }

  /*useEffect(() => {
    const fetchMessage = async () => {
      console.log(messageId)
      const {data: fetchedMessage} = await axios.get(`http://localhost:3001/channels/${channelId}/message/${messageId}`)
      console.log(fetchedMessage)      
      setNewMessage(fetchedMessage)
      setNewContent(fetchedMessage.content)
    }
    fetchMessage()
  }, [])*/

  /*useEffect(() => {
    const set = async () => {
      console.log("hello")
      console.log(message)
      console.log(open)
      setNewContent(message.content)
    }
    set()
  }, [])*/

  const handleCloseEdit = () => {
    console.log(message)
    setOpen(false);
  };

  const handleEdit = () => {
    console.log(message.author)
    console.log(message)
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