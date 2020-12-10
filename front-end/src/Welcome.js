import {} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ReactComponent as ChannelIcon} from './icons/channel.svg';
import {ReactComponent as FriendsIcon} from './icons/friends.svg';
import {ReactComponent as SettingsIcon} from './icons/settings.svg';
import IconButton from '@material-ui/core/IconButton';

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    //background: 'rgba(0,0,0,.2)',
  },
  card: {
    textAlign: 'center',
  },
  icon: {
    width: '100%',
    fill: theme.palette.primary.main,
  }
})

export default () => {
  const styles = useStyles(useTheme())

  const handleCreateChannel = () => {
    window.location.href = '/create-channel'
  }
  const handleInviteFriends = () => {
    alert('Please invite friends directly from the channel manage users button')
  }
  const handleSettings = () => {
    window.location.href = '/account'
  }

  return (
    <div css={styles.root}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item xs>
          <div css={styles.card}>
            <IconButton onClick={handleCreateChannel}>
              <ChannelIcon style={styles.icon} />
            </IconButton>
            <Typography color="textPrimary">
              Create channels
            </Typography>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <IconButton onClick={handleInviteFriends}>
              <FriendsIcon style={styles.icon} />
            </IconButton>
            <Typography color="textPrimary">
              Invite Friends
            </Typography>
          </div>
        </Grid>
        <Grid item xs>
          <div css={styles.card}>
            <IconButton onClick={handleSettings}>
              <SettingsIcon style={styles.icon} />
            </IconButton>
            <Typography color="textPrimary">
              Account settings
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
