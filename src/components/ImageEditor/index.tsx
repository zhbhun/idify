import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import smartcrop from 'smartcrop'
import { useSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import RemoveIcon from '@mui/icons-material/Remove'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Fade from '@mui/material/Fade'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { EDITOR_ZOOM_MAX, EDITOR_ZOOM_MIN, ID_PHOTO_SPECS } from '@/config'
import { useCropSize } from '@/hooks'
import { createIDPhoto, loadImage } from '@/uitls'
import BackgroundColor from './BackgroundColor'
import CloseButton from './CloseButton'
import DarkButton from './DarkButton'
import SpecPicker from './SpecPicker'
import ColorPicker from './ColorPicker'
import SaveButton from './SaveButton'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    button: {
      textTransform: 'none', // 禁止文本大小写转换
    },
  },
})
const CROP_CONTAINER_CLASSNAME = 'editor-crop-container'
const CROP_AREA_CLASSNAME = 'editor-crop-area'

export interface ImageEditorProps {
  image: string
  onClose?(): void
}

export function ImageEditor({ image, onClose }: ImageEditorProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { enqueueSnackbar } = useSnackbar()
  const [spec, setSpec] = useState(ID_PHOTO_SPECS[0])
  const cropSize = useCropSize(spec)
  const [color, setColor] = useState(spec.color)
  const [gradient, setGradient] = useState(0)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [specPickerOpen, setSpecPickerOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  console.log(spec, cropSize)
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'editor',
    })
  }, [])
  useEffect(() => {
    // 根据图片和规格智能计算缩放和裁减区域
    let mounted = true
    loadImage(image).then((image) => {
      if (!mounted) {
        return
      }
      smartcrop
        .crop(image, {
          width: cropSize.width,
          height: cropSize.height,
        })
        .then(({ topCrop }) => {
          if (!mounted) {
            return
          }
          const smartZoom = cropSize.width / topCrop.width
          const smartX =
            (image.naturalWidth / 2) * smartZoom -
            cropSize.width / 2 -
            topCrop.x * smartZoom
          const smartY =
            (image.naturalHeight / 2) * smartZoom -
            cropSize.height / 2 -
            topCrop.y * smartZoom
          setZoom(smartZoom)
          setCrop({ x: smartX, y: smartY })
        })
        .catch(() => {
          // TODO: ...
        })
    })
    return () => {
      mounted = false
    }
  }, [image, cropSize])
  useEffect(() => {
    // 更新背景色
    setColor(spec.color)
  }, [spec])
  useEffect(() => {
    // 更新背景区域
    const { current: containerEle } = containerRef
    if (!containerEle) {
      return
    }
    let animationFrame: number = 0
    const sync = () => {
      animationFrame = requestAnimationFrame(() => {
        const cropAreaEle = containerEle.querySelector(
          `.${CROP_AREA_CLASSNAME}`
        )
        if (cropAreaEle) {
          const cropAreaRect = cropAreaEle.getBoundingClientRect()
          containerEle.style.setProperty(
            '--crop-area-top',
            `${cropAreaRect.top}px`
          )
          containerEle.style.setProperty(
            '--crop-area-left',
            `${cropAreaRect.left}px`
          )
          containerEle.style.setProperty(
            '--crop-area-width',
            `${cropAreaRect.width || cropSize.width}px`
          )
          containerEle.style.setProperty(
            '--crop-area-height',
            `${cropAreaRect.height || cropSize.height}px`
          )
          return
        }
        sync()
      })
    }
    sync()
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('resize', sync)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [cropSize])
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])
  const onSave = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'save',
      })
      const idPhoto = await createIDPhoto({
        image,
        area: croppedArea,
        rotation,
        color,
        gradient,
        resolution: spec.resolution,
      })
      const a = document.createElement('a')
      a.href = idPhoto
      a.download = 'idphoto.jpeg'
      a.click()
      window.gtag?.('event', 'click', {
        object: 'save_success',
      })
    } catch (error) {
      enqueueSnackbar('Save failed.', {
        variant: 'error',
      })
      window.gtag?.('event', 'click', {
        object: 'save_fail',
      })
    }
  }, [image, color, gradient, croppedArea, rotation, spec, enqueueSnackbar])
  return (
    <ThemeProvider theme={theme}>
      <Fade in>
        <Box ref={containerRef} className="absolute inset-0">
          <Box
            className="absolute inset-0"
            sx={{
              '& .reactEasyCrop_CropArea': {
                color: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            <BackgroundColor
              color={color}
              gradient={gradient}
              width={spec.resolution.width}
              height={spec.resolution.height}
            />
            <Cropper
              classes={{
                containerClassName: CROP_CONTAINER_CLASSNAME,
                cropAreaClassName: CROP_AREA_CLASSNAME,
              }}
              image={image}
              aspect={spec.resolution.width / spec.resolution.height}
              crop={crop}
              cropSize={cropSize}
              rotation={rotation}
              zoom={zoom}
              minZoom={EDITOR_ZOOM_MIN}
              maxZoom={EDITOR_ZOOM_MAX}
              restrictPosition={false}
              showGrid={false}
              onCropChange={setCrop}
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
                  setZoom((preZoom) =>
                    Math.max(EDITOR_ZOOM_MIN, preZoom - 0.25)
                  )
                }}
              >
                <RemoveIcon />
              </DarkButton>
              <DarkButton className="cursor-auto">
                {`${Math.floor(zoom * 100)}%`}
              </DarkButton>
              <DarkButton
                onClick={() => {
                  setZoom((preZoom) =>
                    Math.min(EDITOR_ZOOM_MAX, preZoom + 0.25)
                  )
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
              <DarkButton
                onClick={() => {
                  setColorPickerOpen(true)
                }}
              >
                <Box
                  className="relative w-[20px] h-[20px] rounded-sm overflow-hidden"
                  sx={{
                    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
                    backgroundSize: '20px 20px',
                    backgroundColor: '#fff',
                  }}
                >
                  <Box
                    className="absolute inset-0"
                    sx={{
                      backgroundColor: color,
                    }}
                  />
                </Box>
              </DarkButton>
            </ButtonGroup>
          </Stack>
          <CloseButton onClick={onClose} />
          <SaveButton onClick={onSave} />
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
          {colorPickerOpen ? (
            <ColorPicker
              open={colorPickerOpen}
              value={color}
              gradient={gradient}
              onClose={() => {
                setColorPickerOpen(false)
              }}
              onChange={setColor}
              onGradientChange={setGradient}
            />
          ) : null}
        </Box>
      </Fade>
    </ThemeProvider>
  )
}
