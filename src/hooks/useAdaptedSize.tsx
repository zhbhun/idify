import { IDPhotoSpec } from '@/types'
import { useEffect, useState } from 'react'

function getCropSize(spec: IDPhotoSpec) {
  const { resolution } = spec
  const maxWidth = window.innerWidth - 100
  const maxHeight = window.innerHeight - 250
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

export function useAdaptedSize(spec: IDPhotoSpec): {
  width: number
  height: number
} {
  const [size, setSize] = useState(() => getCropSize(spec))
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
    setSizeIfNeed(getCropSize(spec))
    const handleResize = () => {
      setSizeIfNeed(getCropSize(spec))
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [spec])
  return size
}
