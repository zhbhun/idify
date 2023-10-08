import { IDPhotoSpec } from '../types'
import { useEffect, useState } from 'react'

function getCropSize(
  spec: IDPhotoSpec,
  limit: { width: number; height: number } = {
    width: window.innerWidth - 100,
    height: window.innerHeight - 250,
  }
) {
  const { resolution } = spec
  const maxWidth = limit.width
  const maxHeight = limit.height
  if (resolution.width < maxWidth && resolution.height < maxHeight) {
    return resolution
  }
  const widthScale = maxWidth / resolution.width
  const heightScale = maxHeight / resolution.height
  if (widthScale < heightScale) {
    return {
      width: maxWidth,
      height: Math.round(resolution.height * widthScale),
    }
  }
  return {
    width: Math.round(resolution.width * heightScale),
    height: maxHeight,
  }
}

export function useAdaptedSize(
  spec: IDPhotoSpec,
  limit?: {
    width: number
    height: number
  }
): {
  width: number
  height: number
} {
  const [size, setSize] = useState(() => getCropSize(spec, limit))
  useEffect(() => {
    const setSizeIfNeed = (newSize: { width: number; height: number }) => {
      setSize((prevSize) => {
        if (
          newSize.width !== prevSize.width ||
          newSize.height !== prevSize.height
        ) {
          return newSize
        }
        return prevSize
      })
    }
    setSizeIfNeed(getCropSize(spec, limit))
    if (!limit) {
      const handleResize = () => {
        setSizeIfNeed(getCropSize(spec))
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return () => {}
  }, [spec, limit])
  return size
}
