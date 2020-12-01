import {useState, useEffect} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles';
import { ChannelContext } from './Contexts/ChannelContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '200px',
  },
  channel: {
    padding: '.2rem .5rem',
    whiteSpace: 'nowrap', 
  },
}));

export default ({
  onChannel
}) => {
  const styles = useStyles();

  const [channels, setChannels] = useState([])
  useEffect( () => {
    const fetch = async () => {
      const {data: channels} = await axios.get('http://localhost:3001/channels')
      setChannels(channels)
    }
    fetch()
  }, [])
  return (
    <ChannelContext.Consumer>
      {
        value => (
          <ul className={styles.root}>
            { channels.map( (channel, i) => (
              <li key={i} className={styles.channel}>
                <Link
                  href="#"
                  onClick={ (e) => {
                    e.preventDefault()
                    onChannel(channel)
                  }}
                  >
                  {channel.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
    </ChannelContext.Consumer>
  );
}