import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import './main.scss'
import App from './App.tsx'

const rootElement = document.getElementById('root')!

const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
})

ReactDOM.createRoot(rootElement).render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        maxSnack={3}
        autoHideDuration={3000}
      >
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)
