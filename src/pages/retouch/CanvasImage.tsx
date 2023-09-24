import { useCallback, useEffect, useMemo, useRef } from 'react'
import fx, { FxCanvasElement, FxTexture } from '@/vendors/glfx'
import Box from '@mui/material/Box'
import { RetouchAdjustment, useRetouchStore } from '@/stores'
import { createGLFXCanvas, renderGLFXAdjustment } from '@/uitls'

export interface CanvasImageProps {
  image: string
}

export function CanvasImage({ image }: CanvasImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<FxCanvasElement | null>(null)
  const textureRef = useRef<FxTexture | null>(null)
  const render = useCallback((adjustment: RetouchAdjustment) => {
    const { current: canvas } = canvasRef
    const { current: texture } = textureRef
    if (canvas && texture) {
      renderGLFXAdjustment(canvas, texture, adjustment)
    }
  }, [])
  const handleLoad = useCallback(() => {
    const { current: containerEle } = containerRef
    const { current: imgEle } = imgRef
    if (!containerEle || !imgEle) {
      return () => {}
    }
    const { canvas, texture } = createGLFXCanvas(imgEle)
    canvasRef.current = canvas
    textureRef.current = texture
    containerEle.appendChild(canvas)
    render(useRetouchStore.getState().adjustment)
  }, [render])
  const adjustment = useRetouchStore((state) => state.adjustment)
  useEffect(() => {
    render(adjustment)
  }, [render, adjustment])
  useEffect(() => {
    return () => {
      textureRef.current?.destroy()
      canvasRef.current?.remove()
    }
  }, [])
  const container = useMemo(() => {
    return (
      <Box
        ref={containerRef}
        className="absolute inset-o w-full h-full"
        sx={{
          '& canvas': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          },
        }}
      />
    )
  }, [])
  return (
    <>
      <img
        ref={imgRef}
        className="block absolute inset-0 w-full h-full"
        crossOrigin="anonymous"
        src={image}
        onLoad={handleLoad}
      />
      {container}
    </>
  )
}

export default CanvasImage
