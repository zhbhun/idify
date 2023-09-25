import { useCallback, useEffect, useMemo, useRef } from 'react'
import fx, { FxCanvasElement, FxTexture } from '@/vendors/glfx'
import Box from '@mui/material/Box'
import { RetouchAdjustment, useCropStore, useRetouchStore } from '@/stores'
import { createGLFXCanvas, renderGLFXAdjustment } from '@/uitls'
import { useMeasure } from 'react-use'

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
    imgEle.style.opacity = '0'
  }, [render])

  const [measureRef, measureRect] = useMeasure<HTMLDivElement>()
  useEffect(() => {
    const { current: canvas } = canvasRef
    const { current: imgEle } = imgRef
    if (canvas && imgEle) {
      canvas
      const texture = canvas.texture(imgEle)
      textureRef.current = texture
      render(useRetouchStore.getState().adjustment)
    }
  }, [render, measureRect])

  const adjustment = useRetouchStore((state) => state.adjustment)
  useEffect(() => {
    const { current: canvas } = canvasRef
    if (canvas) {
      canvas.width = measureRect.width
      canvas.height = measureRect.height
      render(adjustment)
    }
  }, [render, measureRect, adjustment])

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

  return useMemo(
    () => (
      <Box ref={measureRef} className="absolute inset-o w-full h-full">
        <img
          ref={imgRef}
          className="block absolute top-0 left-0 w-[200%] h-[200%] scale-50 origin-top-left"
          crossOrigin="anonymous"
          src={image}
          onLoad={handleLoad}
        />
        {container}
      </Box>
    ),
    [measureRef, image, container, handleLoad]
  )
}

export default CanvasImage
