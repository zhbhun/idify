import { useState } from 'react'
import Box from '@mui/material/Box'
import { ImageCropper, ImageEditor, Welcome } from '@/components'
import { ID_PHOTO_SPECS } from './config'

function App() {
  const [spec, setSpec] = useState(ID_PHOTO_SPECS[0])
  const [cropping, setCropping] = useState('')
  const [segmenting, setSegmenting] = useState('')
  const [editing, setEditing] = useState('')
  return (
    <Box
      className="absolute inset-0 overflow-hidden"
      sx={{
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
        backgroundSize: '20px 20px',
      }}
    >
      {!cropping && !editing ? (
        <Welcome
          image={segmenting}
          onAdd={setCropping}
          onSegmented={(image) => {
            setSegmenting('')
            setEditing(image)
          }}
        />
      ) : null}
      {cropping && (
        <ImageCropper
          image={cropping}
          onClose={() => {
            setCropping('')
          }}
          onSave={(spec, image) => {
            setSpec(spec)
            setCropping('')
            setSegmenting(image)
          }}
        />
      )}
      {editing && (
        <ImageEditor
          spec={spec}
          image={editing}
          onClose={() => {
            setEditing('')
          }}
        />
      )}
    </Box>
  )
}

export default App
