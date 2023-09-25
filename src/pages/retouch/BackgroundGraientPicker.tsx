import { useCallback } from 'react'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { RangePicker } from '@/components'
import {
  RetouchBackgroundGradient,
  RetouchBackgroundGradientAngle,
  useRetouchStore,
} from '@/stores'

export function ColorPicker() {
  const [background, setBackground] = useRetouchStore((state) => [
    state.background,
    state.setBackground,
  ])
  const {
    gradient: { angle, brightness },
  } = background
  const setGradient = useCallback(
    (newGradient: Partial<RetouchBackgroundGradient>) => {
      const preBackground = useRetouchStore.getState().background
      setBackground({
        ...preBackground,
        gradient: {
          ...preBackground.gradient,
          ...newGradient,
        },
      })
    },
    [setBackground]
  )
  const setAngle = useCallback(
    (newAngle: RetouchBackgroundGradientAngle) => {
      setGradient({
        angle: newAngle,
      })
    },
    [setGradient]
  )
  const setBrightness = useCallback(
    (newBrightness: number) => {
      setGradient({
        brightness: newBrightness,
      })
    },
    [setGradient]
  )
  return (
    <Box className="p-[16px] pb-0">
      <Box className="flex justify-center">
        <ToggleButtonGroup
          className="m-auto px-[16px]"
          sx={{
            '& .MuiToggleButton-root': {
              width: 32,
            },
          }}
          color="secondary"
          exclusive
          size="small"
          value={angle}
          onChange={(event: any, newAngle: string | null) => {
            setAngle(newAngle as RetouchBackgroundGradientAngle)
          }}
        >
          <ToggleButton value="l">L</ToggleButton>
          <ToggleButton value="r">R</ToggleButton>
          <ToggleButton value="t">T</ToggleButton>
          <ToggleButton value="b">B</ToggleButton>
          <ToggleButton value="c">C</ToggleButton>
          <ToggleButton value="tl">TL</ToggleButton>
          <ToggleButton value="tr">TR</ToggleButton>
          <ToggleButton value="bl">BL</ToggleButton>
          <ToggleButton value="br">BR</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <RangePicker
        value={brightness}
        min={-10}
        max={10}
        step={0.1}
        segment={5}
        unit=""
        format={(value) => Math.round(value * 10)}
        onChange={setBrightness}
      />
    </Box>
  )
}

export default ColorPicker
