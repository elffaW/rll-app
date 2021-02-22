import { createMuiTheme } from '@material-ui/core/styles';

const baseTheme = createMuiTheme({
  palette: {
    // gray
    primary: {
      main: '#616161',
      light: '#8e8e8e',
      dark: '#8e0000', // red (same as secondary.dark)
      darker: '#404040', // dark gray
      darkest: '#202020', // darker gray
    },
    // red
    secondary: {
      main: '#c62828',
      light: '#e5737366', // includes transparency
      dark: '#8e0000',
    },
  },
  otherColors: {
    text: {
      lighter: 'whitesmoke',
      light: '#d0d0d0',
      dark: '#202020',
    },
    background: {
      dark: '#4e0000', // darker red
      mainDarker: '#757575',
    },
  },
});

export default baseTheme;
