import { useCallback, useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useAdaptedSize } from '@/hooks'
import { useAppStore, useCropStore, useRetouchStore } from '@/stores'
import { createIDPhoto } from '@/uitls'
import { CloseButton, SaveButton, TextureBackground } from '@/components'
import BackgroundPreview from './BackgroundPreview'
import BottomBar from './BottomBar'
import CanvasImage from './CanvasImage'
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

export interface ImageRetouchProps {}

export default function ImageRetouch(props: ImageRetouchProps) {
  const spec = useCropStore((state) => state.spec)
  const image = useRetouchStore((state) => state.image)
  const { enqueueSnackbar } = useSnackbar()
  const size = useAdaptedSize(spec)
  // image cache to replace empty image while page desotry
  const imageRef = useRef(image)
  useEffect(() => {
    if (image) {
      imageRef.current = image
    }
  }, [image])
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'editor',
    })
  }, [])
  const handleClose = useAppStore((state) => state.cancel)
  const handleSave = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'save',
      })
      const { spec } = useCropStore.getState()
      const { image, background, adjustment } = useRetouchStore.getState()
      const idPhoto = await createIDPhoto({
        image,
        background,
        adjustment,
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
      window.gtag?.('event', 'click', {
        object: 'save_fail',
      })
      enqueueSnackbar('Save failed.', {
        variant: 'error',
      })
    }
  }, [enqueueSnackbar])
  return (
    <ThemeProvider theme={theme}>
      <Box className="absolute inset-0">
        <TextureBackground className="bg-white" />
        <AppBar className="bg-transparent" position="fixed" elevation={0}>
          <Toolbar>
            <CloseButton
              className="mr-4"
              icon={<ArrowBackOutlinedIcon />}
              onClick={handleClose}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Retouch (2/2)
            </Typography>
            <SaveButton onClick={handleSave} />
          </Toolbar>
        </AppBar>
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
          <BackgroundPreview width={size.width} height={size.height} />
          <CanvasImage image={image || imageRef.current} />
        </Box>
        <BottomBar />
      </Box>
    </ThemeProvider>
  )
}
