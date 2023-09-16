import { ReactElement, useCallback, useMemo, useRef } from 'react'
import { useMeasure } from 'react-use'
import Box, { BoxProps } from '@mui/material/Box'

export interface LayoutBoxProps extends Omit<BoxProps, 'children'> {
  children(rect: DOMRect): ReactElement
}

export function LayoutBox({ children, ...props }: LayoutBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [measureRef, measureRect] = useMeasure<HTMLDivElement>()
  const rect = useMemo((): DOMRect => {
    return (
      containerRef.current?.getBoundingClientRect() || (measureRect as DOMRect)
    )
  }, [measureRect])
  const handleRef = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el
      if (el) {
        measureRef(el)
      }
    },
    [measureRef]
  )
  return (
    <Box {...props} ref={handleRef}>
      {children(rect)}
    </Box>
  )
}

export default LayoutBox
