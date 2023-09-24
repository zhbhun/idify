import { useEffect, useRef } from 'react'
import chroma from 'chroma-js'
import Box from '@mui/material/Box'

export interface BackgroundColorProps {
  color: string
  gradient: number
  width: number
  height: number
}

export function BackgroundColor({
  color,
  gradient,
  width,
  height,
}: BackgroundColorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const { current: canvasEle } = canvasRef
    if (canvasEle) {
      canvasEle.width = width
      canvasEle.height = height
    }
    const ctx = canvasEle?.getContext('2d')
    if (ctx && color !== 'transparent') {
      const grd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        (width + height) / 2
      )
      grd.addColorStop(0, color)
      grd.addColorStop(1, chroma(color).darken(gradient).hex())
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)
    }
    return () => {
      if (ctx) {
        ctx.clearRect(0, 0, width, height)
      }
    }
  }, [color, gradient, width, height])
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

export default BackgroundColor
