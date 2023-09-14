import { useState } from 'react'
import Box from '@mui/material/Box'
import { ImageCropper, ImageEditor, Welcome } from '@/components'
import { ID_PHOTO_SPECS } from './config'

function App() {
  const [spec, setSpec] = useState(ID_PHOTO_SPECS[0])
  const [source, setSource] = useState('')
  const [segmented, setSegmented] = useState('')
  const [editing, setEditing] = useState('')
  return (
    <Box
      className="absolute inset-0 overflow-hidden"
      sx={{
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
        backgroundSize: '20px 20px',
      }}
    >
      {!segmented && !editing ? (
        <Welcome
          daemon={!!source}
          onAdd={setSource}
          onSegmented={setSegmented}
        />
      ) : null}
      {source && !editing ? (
        <ImageCropper
          image={source}
          segmentedImage={segmented}
          onClose={() => {
            if (!segmented) {
              // force reset segment
              location.reload()
            } else {
              // TODO: 增加切换动画
              // setSource('')
              // setSegmented('')
            }
          }}
          onSave={(spec, image) => {
            setEditing(image)
            setSpec(spec)
          }}
        />
      ) : null}
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
