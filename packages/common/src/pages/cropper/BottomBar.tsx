import { useState } from 'react'
import { useIntl } from 'react-intl'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import CropRotateIcon from '@mui/icons-material/CropRotate'
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap'
import FlipIcon from '@mui/icons-material/Flip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { RangePicker } from '../../components'
import { CROPPER_ZOOM_MAX, CROPPER_ZOOM_MIN } from '../../config'
import { useCropStore, useSelectedSpec, useSpecStore } from '../../stores'
import SpecPicker from './SpecPicker'

type ActiveType = '' | 'spec' | 'zoom' | 'rotate' | 'flip'

export function BottomBar() {
  const intl = useIntl()
  const [active, setActive] = useState<ActiveType>('')
  const [spec] = useSelectedSpec()
  const {
    rotation,
    setRotation,
    zoom,
    setZoom,
    setFlipHorizontal,
    setFlipVertical,
  } = useCropStore()
  return (
    <Paper
      className="relative flex flex-col grow-0 shrink-0 rounded-t-2xl sm:mx-auto sm:w-[400px]"
      square
      elevation={0}
    >
      {active === 'spec' ? (
        <SpecPicker
          value={spec}
          onClose={() => {
            setActive('')
          }}
        />
      ) : null}
      {active === 'zoom' ? (
        <RangePicker
          value={zoom}
          min={CROPPER_ZOOM_MIN}
          max={CROPPER_ZOOM_MAX}
          precision={0.01}
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
          precision={1}
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
            {intl.formatMessage({ id: 'flipHorizontal' })}
          </Button>
          <Button
            color="inherit"
            startIcon={<FlipIcon className="rotate-90" />}
            onClick={() => {
              setFlipVertical(!useCropStore.getState().flipVertical)
            }}
          >
            {intl.formatMessage({ id: 'flipVertical' })}
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
            <span>{intl.formatMessage({ id: 'size' })}</span>
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
            <span>{intl.formatMessage({ id: 'zoom' })}</span>
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
            <span>{intl.formatMessage({ id: 'rotate' })}</span>
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
            <span>{intl.formatMessage({ id: 'flip' })}</span>
          </Stack>
        </Button>
      </Stack>
    </Paper>
  )
}

export default BottomBar
