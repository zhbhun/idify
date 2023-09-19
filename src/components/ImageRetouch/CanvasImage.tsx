import { useCallback, useEffect, useMemo, useRef } from 'react'
import fx, { FxCanvasElement, FxTexture } from '@/vendors/glfx'
import Box from '@mui/material/Box'

export interface CanvasImageProps {
  image: string
}

export function CanvasImage({ image }: CanvasImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<FxCanvasElement | null>(null)
  const textureRef = useRef<FxTexture | null>(null)
  const render = useCallback(() => {
    const { current: canvas } = canvasRef
    const { current: texture } = textureRef
    if (canvas && texture) {
      canvas.draw(texture).brightnessContrast(0, 0).update()
    }
  }, [])
  const handleLoad = useCallback(() => {
    const { current: containerEle } = containerRef
    const { current: imgEle } = imgRef
    if (!containerEle || !imgEle) {
      return () => {}
    }
    const canvas = fx.canvas()
    canvasRef.current = canvas
    containerEle.appendChild(canvas)
    const texture = canvas.texture(imgEle)
    textureRef.current = texture
    render()
  }, [render])
  useEffect(() => {
    return () => {
      canvasRef.current?.destroy()
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
