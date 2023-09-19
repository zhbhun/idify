import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import Tooltip from '@mui/material/Tooltip'
import { useAppStore, useCropStore, useSegementStore } from '@/stores'

export function ImageSegment() {
  const { error, loading, progress, step, process } = useSegementStore()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  useEffect(() => {
    let timer = 0
    if (loading) {
      // wait animation finish
      timer = setTimeout(() => {
        timer = 0
        setTooltipOpen(true)
      }, 400)
    } else {
      setTooltipOpen(false)
    }
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [loading])
  if (loading) {
    return (
      <Tooltip
        arrow
        open={tooltipOpen}
        placement="left"
        title={step === 1 ? 'AI model downloading ...' : 'Image segmenting...'}
      >
        <Box className="relative z-10">
          <CircularProgress
            className="block text-white"
            variant="determinate"
            color="info"
            size={30}
            value={progress}
          />
          <Box className="absolute top-1/2 left-1/2 text-white text-xs font-bold scale-75 -translate-x-1/2 -translate-y-1/2">
            {`${Math.floor(progress)}%`}
          </Box>
        </Box>
      </Tooltip>
    )
  }
  if (error) {
    return (
      <IconButton
        className="relative z-10 text-white"
        size="small"
        onClick={() => {
          const { image } = useCropStore.getState()
          if (image) {
            process(image)
          }
        }}
      >
        <ReplayOutlinedIcon />
      </IconButton>
    )
  }
  return null
}

export default ImageSegment
