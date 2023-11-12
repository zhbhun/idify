import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Pages, { Welcome } from './pages'
import { useAppStore } from './stores'

export function App() {
  useEffect(() => {
    useAppStore.getState().initiate();
  }, [])
  return (
    <Box className="absolute inset-0 overflow-hidden">
      <Welcome />
      <Pages />
    </Box>
  )
}

export default App
