/** @jsx jsx */
import { jsx } from '@emotion/core'
import {useState} from 'react'
// MUI
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
// Custom components
import Channels from './Channels'
import Channel from './Channel'
import Welcome from './Welcome'

const useStyles = (theme) => ({
  main: {
    overflow: 'hidden',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  drawer: {
    width: '210px',
    display: 'none',
  },
  drawerVisible: {
    display: 'block',
    background: theme.palette.background.default
  },
})

export default ({
  drawerMobileVisible,
}) => {
  const [channel, setChannel] = useState(null)
  const fetchChannel = async (channel) => {
    setChannel(channel)
  }
  const theme = useTheme()
  const styles = useStyles(theme)
  const alwaysOpen = useMediaQuery(theme.breakpoints.up('sm'))
  const isDrawerVisible = alwaysOpen || drawerMobileVisible
  return (
    <main style={styles.main}>
      <Drawer
        PaperProps={{ style: { position: 'relative' } }}
        BackdropProps={{ style: { position: 'relative' } }}
        ModalProps={{
          style: { position: 'relative' }
        }}
        variant="persistent"
        open={isDrawerVisible}
        css={[styles.drawer, isDrawerVisible && styles.drawerVisible]}
      >
        <Channels onChannel={fetchChannel} />
      </Drawer>
      {channel ? <Channel channel={channel} messages={[]} /> : <Welcome />}
    </main>
  );
}
