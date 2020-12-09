import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, useContext, useEffect} from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
// Markdown
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
// Time
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import updateLocale from 'dayjs/plugin/updateLocale'
import ChannelSettings from '../ChannelSettings';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserContext } from '../Contexts/UserContext';
import axios from 'axios';
import MessageEditDialog from './MessageEditDialog'
//import Suppr from '../message-action/Suppr'
//import Editer from '../message-action/Editer'
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
      //backgroundColor: 'rgba(255,255,255,.05)',
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
  },
  icons:{
    marginLeft: "5px",
    //position: "relative",
    //top: "5px",
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

  const handleOpenSettings = () =>{
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const contexUser = useContext(UserContext)

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

  }, [selectedMessage])

  return (
    <div css={styles.root} ref={rootEl}>
      <div css={styles.header}>
        <IconButton css={styles.settings} onClick={handleOpenSettings}>
          <SettingsIcon/>
          <ChannelSettings channel={channel} open={open} onClose={handleClose}/>
        </IconButton>
        <h1 css={styles.h1}>Messages for {channel.name}</h1>
      </div>
      <ul>
        { messages.map( (message, i) => {
            const {contents: content} = unified()
            .use(markdown)
            .use(remark2rehype)
            .use(html)
            .processSync(message.content)
            return (
              <li key={i} css={styles.message}>
                <p>
                  <span css={styles.white}>{message.author}</span>
                  {' - '}
                  <span css={styles.white}>{dayjs().calendar(message.creation)}</span>
                    {contexUser.username === message.author ? 
                    <span>
                      <IconButton value={message.creation} onClick={handleDelete} css={styles.icons}>
                        <DeleteIcon color="primary"/>
                      </IconButton>
                    </span> : ""} 
                    {contexUser.username === message.author ? 
                    <span>
                      <IconButton value={message.creation} onClick={handleEdit} css={styles.icons}>
                        <EditIcon color="primary"/>
                      </IconButton>
                    </span> : ""} 
                </p>
                {/*<div><span><Suppr 
                nMessage={message} 
                /> </span><span><Editer
                OnMessage={message} 
                /></span></div>*/}
                <div css={styles.white} dangerouslySetInnerHTML={{__html: content}}>
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
