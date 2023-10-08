import './polyfill'
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline'
import {
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
  } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import './main.scss'
import App from './App';


const container = document.getElementById('root');
const theme = createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container,
        },
      },
      MuiPopper: {
        defaultProps: {
          container,
        },
      },
      MuiDialog: {
        defaultProps: {
          container,
        },
      },
      MuiModal: {
        defaultProps: {
          container,
        },
      },
    },
  })

const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
      maxSnack={3}
      autoHideDuration={3000}
    >
      <App />
    </SnackbarProvider>
  </ThemeProvider>
</StyledEngineProvider>
);