import { useCallback, useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Fade from '@mui/material/Fade'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useAdaptedSize } from '@/hooks'
import { createIDPhoto } from '@/uitls'
import CloseButton from '../CloseButton'
import DarkButton from '../DarkButton'
import SaveButton from '../SaveButton'
import TextureBackground from '../TextureBackground'
import BackgroundColor from './BackgroundColor'
import ColorPicker from './ColorPicker'
import { useAppStore } from '@/stores'

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

export interface ImageEditorProps {}

export function ImageEditor(props: ImageEditorProps) {
  const [spec, image, onClose] = useAppStore((state) => [
    state.spec,
    state.editing,
    state.cancelEdit,
  ])
  const containerRef = useRef<HTMLElement>(null)
  const { enqueueSnackbar } = useSnackbar()
  const size = useAdaptedSize(spec)
  const [gradient, setGradient] = useState(0)
  const [color, setColor] = useState(spec.color)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  // image cache to replace empty image while page desotry
  const imageRef = useRef(image)
  useEffect(() => {
    if (image) {
      imageRef.current
    }
  }, [image])

  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'editor',
    })
  }, [])

  const onSave = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'save',
      })
      const idPhoto = await createIDPhoto({
        image,
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
  }, [image, color, gradient, spec, enqueueSnackbar])
  return (
    <ThemeProvider theme={theme}>
      <Box ref={containerRef} className="absolute inset-0">
        <TextureBackground className="bg-white" />
        <Box
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          sx={{
            color: 'rgba(0, 0, 0, 0.8)',
            outline: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 0 9999em',
            width: size.width,
            height: size.height,
          }}
        >
          <BackgroundColor
            color={color}
            gradient={gradient}
            width={size.width}
            height={size.height}
          />
          <img
            className="block absolute inset-0 w-full h-full"
            src={image || imageRef.current}
          />
        </Box>
        <Stack
          className="absolute bottom-0 left-1/2 w-auto px-[12px] pb-[10px] -translate-x-1/2"
          direction="row"
          spacing={1}
        >
          <ButtonGroup size="small" variant="contained">
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
        <CloseButton icon={<ArrowBackOutlinedIcon />} onClick={onClose} />
        <SaveButton onClick={onSave} />
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
    </ThemeProvider>
  )
}
