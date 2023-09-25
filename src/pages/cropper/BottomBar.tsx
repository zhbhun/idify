import { useState } from 'react'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import CropRotateIcon from '@mui/icons-material/CropRotate'
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap'
import FlipIcon from '@mui/icons-material/Flip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { RangePicker } from '@/components'
import { CROPPER_ZOOM_MAX, CROPPER_ZOOM_MIN } from '@/config'
import { useCropStore } from '@/stores'
import SpecPicker from './SpecPicker'

type ActiveType = '' | 'spec' | 'zoom' | 'rotate' | 'flip'

export function BottomBar() {
  const [active, setActive] = useState<ActiveType>('')
  const {
    spec,
    setSpec,
    rotation,
    setRotation,
    zoom,
    setZoom,
    setFlipHorizontal,
    setFlipVertical,
  } = useCropStore()
  return (
    <Paper
      className="absolute bottom-0 left-0 w-full rounded-t-2xl overflow-hidden sm:left-1/2 sm:w-[400px] sm:-translate-x-1/2"
      square
      elevation={0}
    >
      {active === 'spec' ? (
        <SpecPicker
          value={spec}
          onPick={(spec) => {
            setActive('')
            setSpec(spec)
          }}
        />
      ) : null}
      {active === 'zoom' ? (
        <RangePicker
          value={zoom}
          min={CROPPER_ZOOM_MIN}
          max={CROPPER_ZOOM_MAX}
          step={0.01}
          segment={5}
          unit="%"
          format={(value) => Math.round(value * 100)}
          onChange={setZoom}
        />
      ) : null}
      {active === 'rotate' ? (
        <RangePicker
          value={rotation}
          min={-180}
          max={180}
          step={2}
          segment={5}
          unit="°"
          format={(value) => Math.round(value)}
          onChange={setRotation}
        />
      ) : null}
      {active === 'flip' ? (
        <Stack
          className="px-[16px] py-[12px]"
          direction="row"
          justifyContent="space-around"
        >
          <Button
            color="inherit"
            startIcon={<FlipIcon />}
            onClick={() => {
              setFlipHorizontal(!useCropStore.getState().flipHorizontal)
            }}
          >
            Flip horizontal
          </Button>
          <Button
            color="inherit"
            startIcon={<FlipIcon className="rotate-90" />}
            onClick={() => {
              setFlipVertical(!useCropStore.getState().flipVertical)
            }}
          >
            Flip vertical
          </Button>
        </Stack>
      ) : null}
      {active ? <Divider /> : null}
      <Stack
        className="py-[6px] px-[10px]"
        direction="row"
        justifyContent="space-around"
      >
        <Button
          size="small"
          color={active === 'spec' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'spec' ? '' : 'spec'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <AspectRatioIcon fontSize="small" />
            <span>{`${spec.resolution.width}*${spec.resolution.height}`}</span>
          </Stack>
        </Button>
        <Button
          size="small"
          color={active === 'zoom' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'zoom' ? '' : 'zoom'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <ZoomInMapIcon fontSize="small" />
            <span>Zoom</span>
          </Stack>
        </Button>
        <Button
          size="small"
          color={active === 'rotate' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'rotate' ? '' : 'rotate'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <CropRotateIcon fontSize="small" />
            <span>Rotate</span>
          </Stack>
        </Button>
        <Button
          size="small"
          color={active === 'flip' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'flip' ? '' : 'flip'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <FlipIcon fontSize="small" />
            <span>Flip</span>
          </Stack>
        </Button>
      </Stack>
    </Paper>
  )
}

export default BottomBar
