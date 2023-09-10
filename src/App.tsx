import { useState } from 'react'
import Box from '@mui/material/Box'
import { ImageEditor, Welcome } from '@/components'

function App() {
  const [editing, setEditing] = useState('')
  return (
    <Box
      className="relative w-screen h-screen overflow-hidden"
      sx={{
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
        backgroundSize: '20px 20px',
      }}
    >
      {editing ? (
        <ImageEditor
          image={editing}
          onClose={() => {
            setEditing('')
          }}
        />
      ) : (
        <Welcome onOpen={setEditing} />
      )}
    </Box>
  )
}

export default App
