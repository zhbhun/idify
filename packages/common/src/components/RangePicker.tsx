import classNames from 'classnames'
import { throttle } from 'lodash-es'
import {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import { BOTTOM_WIDTH_PC } from '../config'
import { usePC } from '../hooks'
import { ConfigContext } from '.'

const DOT_LARGE_SIZE = 2
const DOT_SMALL_SIZE = 0.75
const DOT_INTERVAL = 10

export interface RangePickerProps extends Omit<BoxProps, 'value' | 'onChange'> {
  value: number
  max: number
  min: number
  step: number
  segment: number
  precision: number
  unit?: string
  format?(value: number): ReactNode
  onChange?(value: number): void
}

export function RangePicker({
  className,
  value,
  max,
  min,
  step,
  segment,
  precision,
  unit = '',
  format,
  onChange,
  ...props
}: RangePickerProps) {
  const config = useContext(ConfigContext)
  const propsRef = useRef({
    max,
    min,
    precision,
    step,
    value,
    onChange,
  })
  useEffect(() => {
    propsRef.current.max = max
    propsRef.current.min = min
    propsRef.current.precision = precision
    propsRef.current.step = step
    propsRef.current.value = value
    propsRef.current.onChange = onChange
  }, [max, min, precision, step, value, onChange])
  const range = max - min
  const totalSteps = Math.round(range / step)
  const rangeWidth = totalSteps * DOT_INTERVAL + DOT_LARGE_SIZE * 2
  const rangePaths = useMemo(() => {
    const result = []
    for (let index = 0; index <= totalSteps; index++) {
      const large = index % segment === 0
      result.push(
        `M ${
          index * DOT_INTERVAL + (large ? 0 : DOT_LARGE_SIZE - DOT_INTERVAL)
        } 28 a ${
          large
            ? `${DOT_LARGE_SIZE} ${DOT_LARGE_SIZE}`
            : `${DOT_SMALL_SIZE} ${DOT_SMALL_SIZE}`
        } 0 1 0 0 -1`
      )
    }
    return result.join(' ')
  }, [totalSteps, segment])
  const valueRef = useRef(value)
  const touchedRef = useRef(false)
  const touchStartXRef = useRef(0)
  useEffect(() => {
    if (!touchedRef.current) {
      valueRef.current = value
    }
  }, [value])
  const handlePonterDown = useCallback(
    (event: ReactPointerEvent) => {
      touchedRef.current = true
      touchStartXRef.current = event.clientX
      const haptic = throttle(() => {
        config.haptic?.();
      }, 16);
      const handleMove = (event: PointerEvent) => {
        if (touchedRef.current) {
          const offsetX =
            ((event.clientX - touchStartXRef.current) / DOT_INTERVAL) *
            propsRef.current.step
          const precision = 1 / propsRef.current.precision
          const newValue =
            Math.round(
              Math.min(
                Math.max(valueRef.current - offsetX, propsRef.current.min),
                propsRef.current.max
              ) * precision
            ) / precision

          if (newValue !== propsRef.current.value) {
            haptic()
          }
          propsRef.current.onChange?.(newValue)
        }
      }
      const handleUp = (event: PointerEvent) => {
        touchedRef.current = false
        const offsetX =
          ((event.clientX - touchStartXRef.current) / DOT_INTERVAL) *
          propsRef.current.step
        const newValue = Math.min(
          Math.max(valueRef.current - offsetX, propsRef.current.min),
          propsRef.current.max
        )
        const precision = 1 / propsRef.current.precision
        propsRef.current.onChange?.(
          Math.round(newValue * precision) / precision
        )
        valueRef.current = newValue
        document.removeEventListener('pointermove', handleMove)
        document.removeEventListener('pointerup', handleUp)
        document.removeEventListener('pointercancel', handleUp)
      }
      document.addEventListener('pointermove', handleMove)
      document.addEventListener('pointerup', handleUp)
      document.addEventListener('pointercancel', handleUp)
    },
    [config]
  )
  const pc = usePC()
  const offsetX =
    0 -
    ((value - min) / step) * DOT_INTERVAL +
    (pc ? BOTTOM_WIDTH_PC : window.innerWidth) / 2
  return (
    <Box
      {...props}
      className={classNames('relative overflow-hidden', className)}
      sx={{
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        '&::before': {
          content: '" "',
          position: 'absolute',
          zIndex: 1,
          left: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: 'linear-gradient(to right, #121212, rgba(0, 0, 0, 0))',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '" "',
          position: 'absolute',
          zIndex: 1,
          right: 0,
          top: 0,
          bottom: 0,
          width: 100,
          background: 'linear-gradient(to left, #121212, rgba(0, 0, 0, 0))',
          pointerEvents: 'none',
        },
      }}
    >
      <svg
        className="block"
        width={rangeWidth}
        height="56"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${rangeWidth} 56`}
        focusable="false"
        style={{
          transform: `translate(${offsetX}px, 0)`,
          touchAction: 'none',
        }}
        onPointerDown={handlePonterDown}
      >
        <path d={rangePaths} fill="currentColor"></path>
      </svg>
      <Box
        className="absolute top-1/2 left-1/2 py-[4px] px-[6px] -translate-x-1/2 -translate-y-1/2"
        sx={{
          background: 'radial-gradient(#121212, rgba(0, 0, 0, 0))',
          pointerEvents: 'none',
        }}
      >
        {`${format ? format(value) : value}${unit}`}
      </Box>
    </Box>
  )
}

export default RangePicker
