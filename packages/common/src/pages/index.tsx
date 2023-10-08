import classNames from 'classnames'
import { CSSProperties, ReactNode, useEffect, useMemo, useRef } from 'react'
import { AnimatedProps, animated, useTransition } from '@react-spring/web'
import { usePC } from '../hooks'
import { useAppStore } from '../stores'
import Cropper from './cropper'
import Retouch from './retouch'
import Welcome from './welcome'

export { Cropper, Retouch, Welcome }

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

export function PageSwitch() {
  const index = useAppStore((state) => state.step)
  const indexRef = useRef(index)
  const pc = usePC()
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
          <Cropper />
        </Page>
      )
    } else if (i === 2) {
      return (
        <Page index={i} style={style}>
          <Retouch />
        </Page>
      )
    }
    return <Page index={0} className="hidden" style={style} />
  })
}

export default PageSwitch
