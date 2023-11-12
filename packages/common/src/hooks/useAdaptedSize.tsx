import { IDPhotoSpec } from '../types'
import { useEffect, useState } from 'react'

function getCropSize(
  spec: IDPhotoSpec,
  limit: { width: number; height: number } = {
    width: window.innerWidth - 100,
    height: window.innerHeight - 250,
  }
) {
  const { dimension } = spec
  const maxWidth = limit.width
  const maxHeight = limit.height
  if (dimension.width < maxWidth && dimension.height < maxHeight) {
    return dimension
  }
  const widthScale = maxWidth / dimension.width
  const heightScale = maxHeight / dimension.height
  if (widthScale < heightScale) {
    return {
      width: maxWidth,
      height: Math.round(dimension.height * widthScale),
    }
  }
  return {
    width: Math.round(dimension.width * heightScale),
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
