import {useEffect, useContext} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles';
import { ChannelsContext } from './Contexts/ChannelsContext';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap', 
  },
  text:{
    color: "#ffffff"
  },
  button:{
    position: "relative",
    top: "2px",
    marginLeft: "2%"
  }
}));

export default ({
  onChannel
}) => {
  const styles = useStyles();
  const contextChannels = useContext(ChannelsContext)

  useEffect( () => {
    const fetch = async () => {
      const {data: channels} = await axios.get('http://localhost:3001/channels')
      contextChannels.setChannelsContext(channels)
    }
    fetch()
    // eslint-disable-next-line
  }, []) 
  //https://stackoverflow.com/questions/57859484/useeffect-runs-infinite-loop-despite-no-change-in-dependencies
  //Le pointeur de l'array change mais pas son contenu. Cependant, useEffect continue de croire qu'il a changé.
  
  return (
      <ul className={styles.root}>
        { contextChannels.channels.map( (channel, i) => (
          <li key={i} className={styles.channel}>
            <Button variant="contained" color="primary" css={{marginLeft:"2%", marginTop:"2%", width: "95%"}}>
              <Link
                className={styles.text}
                href="#"
                onClick={ (e) => {
                  e.preventDefault()
                  onChannel(channel)
                }}
                >
                {channel.name}
                
              </Link>
            </Button>
          </li>
        ))}
      </ul>
  );
}