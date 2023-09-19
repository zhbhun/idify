import Box from '@mui/material/Box'
import { PageSwitch, Welcome } from '@/components'

function App() {
  return (
    <Box className="absolute inset-0 overflow-hidden">
      <Welcome />
      <PageSwitch />
    </Box>
  )
}

export default App
