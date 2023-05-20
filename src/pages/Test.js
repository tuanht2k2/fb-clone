import { Button, TextField, ThemeProvider, createTheme } from '@mui/material';
import './Test.css';

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#ffffff',
  //   },
  // },
  // typography: {
  //   allVariants: {
  //     color: 'white',
  //   },
  // },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'red',
          fontSize: '16px',
        },
        label: {
          color: 'red',
          fontSize: '16px',
        },
      },
    },
  },
});

function Test() {
  return (
    <ThemeProvider theme={theme}>
      <TextField variant="standard" label="test" InputLabelProps={{ className: 'test' }} className="box" />
    </ThemeProvider>
  );
}

export default Test;
