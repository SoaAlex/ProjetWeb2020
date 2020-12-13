/** @jsx jsx */
import { jsx } from '@emotion/core'
import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, useContext, useEffect} from 'react'
import '../../index.css'
import axios from 'axios';
// MUI
import { useTheme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import { Avatar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
// Custom Components
import ChannelSettings from './ChannelSettings';
import MessageEditDialog from './MessageEditDialog'
// Context
import { UserContext } from '../../Contexts/UserContext';

dayjs.extend(calendar)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  calendar: {
    sameElse: 'DD/MM/YYYY hh:mm A'
  }
})

const useStyles = (theme) => ({
  root: {
    position: 'relative',
    flex: '1 1 auto',
    overflow: 'auto',
    '& ul': {
      'margin': 0,
      'padding': 0,
      'textIndent': 0,
      'listStyleType': 0,
    },
  },
  message: {
    padding: '.2rem .5rem',
    ':hover': {
    },
  },
  fabWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50px',
  },
  fab: {
    position: 'fixed !important',
    top: 0,
    width: '50px',
  },
  white:{
    color: theme.palette.text.primary
  },
  h1:{
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  header:{
    display: 'inline-flex',
    width: '100%'
  },
  settings:{
    marginRight: '30%',
    height: '40px',
    position: 'relative',
    top: '20px',
    marginLeft: '15px'
  },
  icons:{
    marginLeft: '0px',
    padding: '5px',
    position: "relative",
    top: "-2px",
  },
  selfMessage:{
    textAlign: 'end',
    padding: '.2rem .5rem',
    ':hover': {
    },
  },
  right:{
    float: "right"
  },
  left:{
    float:"left"
  },
  author:{
    fontWeight: 'bold',
    color: theme.palette.text.primary
  },
  p:{
    marginBottom: "10px",
    marginTop: "20px",
  },
  text:{
    position: "relative",
    top: "9px",
    marginRight: "10px",
    marginLeft: "10px",
  }
})

export default forwardRef(({
  channel,
  messages,
  onScrollDown,
  refreshMessages
}, ref) => {
  const styles = useStyles(useTheme())
  // Expose the `scroll` action
  useImperativeHandle(ref, () => ({
    scroll: scroll
  }));
  const rootEl = useRef(null)
  const scrollEl = useRef(null)
  const scroll = () => {
    scrollEl.current.scrollIntoView()
  }
  // See https://dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj
  const throttleTimeout = useRef(null) // react-hooks/exhaustive-deps
  useLayoutEffect( () => {
    const rootNode = rootEl.current // react-hooks/exhaustive-deps
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null
          const {scrollTop, offsetHeight, scrollHeight} = rootNode // react-hooks/exhaustive-deps
          onScrollDown(scrollTop + offsetHeight < scrollHeight)
        }, 200)
      }
    }
    handleScroll()
    rootNode.addEventListener('scroll', handleScroll)
    return () => rootNode.removeEventListener('scroll', handleScroll)
  })

  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("")
  const [selectedMsgId, setSelectedMsgId] = useState("")
  const [avatarUsers, setAvatarUsers] = useState(new Map())

  const handleOpenSettings = () =>{
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const contextUser = useContext(UserContext)

  const handleEdit = async (e) => {
    const id = e.currentTarget.value
    const {data: fetchedMessage} = await axios.get(`http://localhost:3001/channels/${channel.id}/message/${id}`)
    setSelectedMsgId(id)
    setSelectedMessage(JSON.parse(fetchedMessage))
    setOpenEdit(true);
  }

  const handleDelete = (e) => {
    axios.delete(`http://localhost:3001/channels/${channel.id}/messages/${e.currentTarget.value}`, {}, {withCredentials: true}).then(function (response){
      refreshMessages()
    }).catch(function (error){
      alert("An unattended error occured. One more bug.")
    })
  }

  useEffect(() => {
    var tmpMap = new Map()
    const fetch = async () => {
      for(var user in channel.users){
        const {data: tmpAvatar} = await axios.get(`http://localhost:3001/users/${channel.users[user]}/avatar`, {}, {withCredentials: true})
        tmpMap.set(channel.users[user], tmpAvatar)
      }
    }
    fetch()
    setAvatarUsers(tmpMap)
  }, [channel.users])

  const getAvatars = () => {
    setAvatarUsers(avatarUsers)
  }

  window.onload = getAvatars

  return (
    <div css={styles.root} ref={rootEl}>
      <div css={styles.header}>

        <Button
          variant="contained"
          color="primary"
          css={styles.settings}
          onClick={handleOpenSettings}
          endIcon={<SettingsIcon />}
        >
          Manage users
        </Button>
        <ChannelSettings channel={channel} open={open} onClose={handleClose}/>
        <h1 css={styles.h1}>Messages for {channel.name}</h1>
      </div>
      <ul>
        { messages.map( (message, i) => {
            return (
              <li key={i} css={message.author === contextUser.username ? styles.selfMessage: styles.message}>
                <p css={styles.p}>
                  {contextUser.username === message.author ? 
                  <span>
                    <IconButton value={message.creation} onClick={handleDelete} css={styles.icons}>
                      <DeleteIcon color="primary"/>
                    </IconButton>
                  </span> : ""} 
                  {contextUser.username === message.author ? 
                  <span>
                    <IconButton value={message.creation} onClick={handleEdit} css={styles.icons}>
                      <EditIcon color="primary"/>
                    </IconButton>
                  </span> : ""} 
                  <span css={styles.author}>{message.author}</span>
                  {' - '}
                  <span css={styles.white}>{dayjs().calendar(message.creation)}</span>
                </p>
                  <div css={styles.white}>
                  <Avatar css={message.author === contextUser.username ? styles.right: styles.left} src={avatarUsers.get(message.author)}/>
                  <span css={styles.text}>{message.content}</span>
                  </div>
              </li>
            )
        })}
      </ul>
      <MessageEditDialog 
        open={openEdit} 
        setOpen={setOpenEdit} 
        refreshMessages={refreshMessages}
        channelId = {channel.id}
        message = {selectedMessage}
        setNewMessage = {setSelectedMessage}
        creation = {selectedMsgId}
      />
      <div ref={scrollEl} />
    </div>
  )
})
