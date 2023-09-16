import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { useSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import RemoveIcon from '@mui/icons-material/Remove'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { EDITOR_ZOOM_MAX, EDITOR_ZOOM_MIN } from '@/config'
import { useAdaptedSize } from '@/hooks'
import { useAppStore, useCropStore } from '@/stores'
import { cropIDPhoto } from '@/uitls'
import DarkButton from './DarkButton'
import CloseButton from './CloseButton'
import SaveButton from './SaveButton'
import SegementAlert from './SegementAlert'
import SpecPicker from './SpecPicker'
import TextureBackground from './TextureBackground'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
})

const CROP_CONTAINER_CLASSNAME = 'editor-crop-container'
const CROP_AREA_CLASSNAME = 'editor-crop-area'

export interface ImageCropperProps {}

export function ImageCropper(props: ImageCropperProps) {
  const [image, segmentedImage, spec, setSpec] = useAppStore((state) => [
    state.source,
    state.segmented,
    state.spec,
    state.setSpec,
  ])
  const containerRef = useRef<HTMLElement>(null)
  const { enqueueSnackbar } = useSnackbar()
  const cropSize = useAdaptedSize(spec)
  const {
    position,
    setPosition,
    rotation,
    setRotation,
    zoom,
    setZoom,
    area: croppedArea,
    setArea: setCroppedArea,
  } = useCropStore()
  const [specPickerOpen, setSpecPickerOpen] = useState(false)
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'crop',
    })
  }, [])
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])
  const handleSave = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'crop',
      })
      const idPhoto = await cropIDPhoto({
        image: segmentedImage || image,
        area: croppedArea,
        rotation,
        resolution: spec.resolution,
      })
      window.gtag?.('event', 'click', {
        object: 'crop_success',
      })
      useAppStore.getState().addEditing(idPhoto)
    } catch (error) {
      window.gtag?.('event', 'click', {
        object: 'crop_fail',
      })
      enqueueSnackbar('Save failed.', {
        variant: 'error',
      })
    }
  }, [image, segmentedImage, croppedArea, rotation, spec, enqueueSnackbar])
  const handleClose = useCallback(() => {
    const { segmented, cancel } = useAppStore.getState()
    if (segmented) {
      cancel()
    } else {
      // force reset segment
      location.reload()
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Box ref={containerRef} className="absolute inset-0 w-full h-full">
        {segmentedImage ? <TextureBackground className="bg-white" /> : null}
        <Box
          className="absolute inset-0"
          sx={{
            '& .reactEasyCrop_CropArea': {
              color: segmentedImage
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          <Cropper
            classes={{
              containerClassName: CROP_CONTAINER_CLASSNAME,
              cropAreaClassName: CROP_AREA_CLASSNAME,
            }}
            image={segmentedImage || image}
            aspect={spec.resolution.width / spec.resolution.height}
            crop={position}
            cropSize={cropSize}
            rotation={rotation}
            zoom={zoom}
            minZoom={EDITOR_ZOOM_MIN}
            maxZoom={EDITOR_ZOOM_MAX}
            restrictPosition={false}
            showGrid={false}
            onCropChange={setPosition}
            onCropComplete={onCropComplete}
            onRotationChange={setRotation}
            onZoomChange={setZoom}
          />
        </Box>
        <Stack
          className="absolute bottom-0 left-1/2 w-auto px-[12px] pb-[10px] -translate-x-1/2"
          direction="row"
          spacing={1}
        >
          <ButtonGroup
            className="max-sm:hidden"
            size="small"
            variant="contained"
          >
            <DarkButton
              onClick={() => {
                setZoom((preZoom) => Math.max(EDITOR_ZOOM_MIN, preZoom - 0.25))
              }}
            >
              <RemoveIcon />
            </DarkButton>
            <DarkButton className="cursor-auto">
              {`${Math.floor(zoom * 100)}%`}
            </DarkButton>
            <DarkButton
              onClick={() => {
                setZoom((preZoom) => Math.min(EDITOR_ZOOM_MAX, preZoom + 0.25))
              }}
            >
              <AddIcon />
            </DarkButton>
            <DarkButton
              onClick={() => {
                setRotation((preRotation) => {
                  const newRotation = preRotation + 90
                  return newRotation < 360 ? newRotation : newRotation - 360
                })
              }}
            >
              <RotateRightIcon />
            </DarkButton>
            <DarkButton disableRipple>
              <Slider
                className="w-[50px]"
                size="small"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(_, value) => {
                  if (typeof value === 'number') {
                    setRotation(value)
                  }
                }}
                aria-labelledby="input-slider"
              />
            </DarkButton>
          </ButtonGroup>
          <ButtonGroup size="small" variant="contained">
            <DarkButton
              startIcon={<AspectRatioIcon />}
              onClick={() => {
                setSpecPickerOpen(true)
              }}
            >
              {`${spec.resolution.width}*${spec.resolution.height}px`}
            </DarkButton>{' '}
          </ButtonGroup>
        </Stack>
        <CloseButton onClick={handleClose} />
        {segmentedImage ? (
          <SaveButton icon={<DoneAllOutlinedIcon />} onClick={handleSave} />
        ) : null}
        {specPickerOpen ? (
          <SpecPicker
            open={specPickerOpen}
            value={spec}
            onClose={() => {
              setSpecPickerOpen(false)
            }}
            onPick={(spec) => {
              setSpecPickerOpen(false)
              setSpec(spec)
            }}
          />
        ) : null}
        <SegementAlert />
      </Box>
    </ThemeProvider>
  )
}
