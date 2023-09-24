import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useRetouchStore } from '@/stores'
import { drawCanvasBackground } from '@/uitls'

export interface BackgroundColorProps {
  width: number
  height: number
}

export function BackgroundPreview({ width, height }: BackgroundColorProps) {
  const background = useRetouchStore((state) => state.background)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const { current: canvasEle } = canvasRef
    if (canvasEle) {
      canvasEle.width = width
      canvasEle.height = height
      drawCanvasBackground(canvasEle, background)
    }
    return () => {
      canvasEle?.getContext('2d')?.clearRect(0, 0, width, height)
    }
  }, [background, width, height])
  return (
    <Box className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width, height }}
      />
    </Box>
  )
}

export default BackgroundPreview
