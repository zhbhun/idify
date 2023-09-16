import classNames from 'classnames'
import { CSSProperties, forwardRef, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import ImageAdd from './ImageAdd'
import ImageSegment from './ImageSegment'
import { useAppStore, useSegementStore } from '@/stores'

const DAEMON_WIDTH = 68
const DAEMON_HEIGHT = 68
const DAEMON_TOP = 4
const DAEMON_RIGHT = 4

export interface ImageCloudProps {
  rect: DOMRect
}

export const ImageCloud = forwardRef<HTMLDivElement, ImageCloudProps>(
  ({ rect }: ImageCloudProps, ref) => {
    const source = useAppStore((state) => state.source)
    const segmenting = useSegementStore((state) => state.loading)
    const daemon = useMemo(() => !!source || segmenting, [source, segmenting])
    const [daemoned, setDaemoned] = useState(false)
    useEffect(() => {
      setDaemoned(daemon)
    }, [daemon])
    const style = useMemo((): CSSProperties => {
      if (daemoned) {
        return {
          opacity: 1,
          width: DAEMON_WIDTH,
          height: DAEMON_HEIGHT,
          transform: 'translate3d(0, 0, 0)',
        }
      } else if (daemon) {
        return {
          opacity: 0,
          width: rect.width,
          height: rect.height,
          transform: `translate3d(${
            rect.left - (window.innerWidth - (rect.width + DAEMON_RIGHT))
          }px, ${rect.top - DAEMON_TOP}px, 0)`,
        }
      }
      return {}
    }, [daemon, daemoned, rect])
    return (
      <Box
        ref={ref}
        className={classNames(
          'relative flex flex-col items-center justify-center w-full h-full',
          {
            '!fixed !z-[10] !top-[4px] !right-[4px]': daemon,
          }
        )}
        sx={{
          transition: daemon ? 'all 0.3s ease-in' : '',
          // animation duration is double than wave effect
          animation: daemon ? '' : 'cloud-enter 0.6s ease-out',
          '@keyframes cloud-enter': {
            '0%': {
              opacity: 0,
              transform: 'translate3D(0, 100vh, 0) scale(0)',
            },
            '50%': {
              transform: 'translate3D(0, 50vh, 0) scale(0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translate3D(0, 0, 0) scale(1)',
            },
          },
        }}
        style={style}
      >
        {daemon ? <ImageSegment /> : <ImageAdd />}
      </Box>
    )
  }
)

export default ImageCloud
