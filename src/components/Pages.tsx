import classNames from 'classnames'
import { CSSProperties, ReactNode, useEffect, useMemo, useRef } from 'react'
import { AnimatedProps, animated, useTransition } from '@react-spring/web'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ImageCropper, ImageEditor } from '@/components'
import { useAppStore } from '@/stores'

function Page({
  index,
  className,
  ...props
}: AnimatedProps<{ style: CSSProperties }> & {
  index: number
  className?: string
  children?: ReactNode
}) {
  return (
    <animated.div
      {...props}
      className={classNames('absolute inset-0 w-full h-full', className, {
        'z-[0]': index === 0,
        'z-[1]': index === 1,
        'z-[2]': index === 2,
      })}
    />
  )
}

export function Pages() {
  const [source, editing] = useAppStore((state) => [
    state.source,
    state.editing,
  ])
  /**
   * - 0: select photo
   * - 1: crop photo
   * - 2：edit photo
   */
  const index = useMemo(() => {
    if (editing) {
      return 2
    } else if (source) {
      return 1
    }
    return 0
  }, [source, editing])
  const indexRef = useRef(index)
  const pc = useMediaQuery('(min-width:640px)')
  const [transitions, transRef] = useTransition(
    index,
    () =>
      pc
        ? {
            from:
              index > indexRef.current
                ? { opacity: 0, y: '20%' }
                : {
                    opacity: 1,
                    y: '0%',
                  },
            enter: { opacity: 1, y: '0%' },
            leave: { opacity: 0, y: '0%' },
          }
        : {
            from: index > indexRef.current ? { x: '100%' } : { x: '-50%' },
            enter: { x: '0%' },
            leave: index > indexRef.current ? { x: '-50%' } : { x: '100%' },
          },
    [pc, index]
  )
  useEffect(() => {
    transRef.start()
    indexRef.current = index
  }, [index])
  return transitions((style, i) => {
    if (i === 1) {
      return (
        <Page index={i} style={style}>
          <ImageCropper />
        </Page>
      )
    } else if (i === 2) {
      return (
        <Page index={i} style={style}>
          <ImageEditor />
        </Page>
      )
    }
    return <Page index={0} className="hidden" style={style} />
  })
}

export default Pages
