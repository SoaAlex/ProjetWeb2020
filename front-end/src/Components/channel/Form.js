/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useState, useContext } from 'react'
import axios from 'axios';
// MUI
import Button from "@material-ui/core/Button"
import SendIcon from "@material-ui/icons/Send";
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
// Context
import { UserContext } from '../../Contexts/UserContext'

const useStyles = (theme) => {
  // See https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/OutlinedInput/OutlinedInput.js
  const borderColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';

  return {
    form: {
      borderTop: `2px solid ${borderColor}`,
      padding: '.5rem',
      display: 'flex',
    },
    content: {
      flex: '1 1 auto',
      '&.MuiTextField-root': {
        marginRight: theme.spacing(1),
      },
    },
    send: {
      height: '100%'
    },
  }
}

export default ({
  addMessage,
  channel,
}) => {
  const [content, setContent] = useState('')
  const styles = useStyles(useTheme())
  const contextUser = useContext(UserContext)
  const onSubmit = async () => {
    const {data: message} = await axios.post(
      `http://localhost:3001/channels/${channel.id}/messages`
    , {
      content: content,
      author: contextUser.username,
    })
    addMessage(message)
    setContent('')
  }
  const handleChange = (e) => {
    setContent(e.target.value)
  }
  return (
    <form css={styles.form} onSubmit={onSubmit} noValidate>
      <TextField
        id="outlined-multiline-flexible"
        label="Message"
        multiline
        rowsMax={4}
        value={content}
        onChange={handleChange}
        variant="outlined"
        css={styles.content}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          css={styles.send}
          endIcon={<SendIcon />}
          onClick={onSubmit}
        >
          Send
        </Button>
      </div>
    </form>
  )
}
