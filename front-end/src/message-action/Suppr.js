import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
import Button from "@material-ui/core/Button"
import { useTheme } from '@material-ui/core/styles';
import { boolean } from 'yargs';
const useStyles = (theme) => {
   
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
    OnMessage,
  }) =>{
    const styles = useStyles(useTheme())
    const onSubmit = async () => {
    if(window.confirm("Supprimer ce message ?"))
    {

    //supprimer 
    }
       
    //const {data: message} = await axios.post(
          //`http://localhost:3001/channels/${channel.id}/messages`
       
      }
    return(
    <form css={styles.form} onSubmit={onSubmit} >
        <span>
        <Button
        onClick={onSubmit}
        >
        Supprimer
      </Button></span></form>
    );
  }