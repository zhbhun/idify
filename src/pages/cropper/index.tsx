import { useCallback, useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useAppStore, useCropStore, useSegementStore } from '@/stores'
import { cropIDPhoto } from '@/uitls'
import {
  CloseButton,
  SaveButton,
  SegementAlert,
  TextureBackground,
} from '@/components'
import BottomBar from './BottomBar'
import LiveCropper from './LiveCropper'

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

export default function Cropper() {
  const segmentedImage = useSegementStore((state) => state.result)
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'crop',
    })
  }, [])
  const handleSave = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'crop',
      })
      const { image, spec } = useCropStore.getState()
      const { rotation, area: croppedArea } = useCropStore.getState()
      const idPhoto = await cropIDPhoto({
        image: segmentedImage || image,
        area: croppedArea,
        rotation,
        resolution: spec.resolution,
      })
      window.gtag?.('event', 'click', {
        object: 'crop_success',
      })
      useAppStore.getState().retouch(idPhoto)
    } catch (error) {
      window.gtag?.('event', 'click', {
        object: 'crop_fail',
      })
      enqueueSnackbar('Save failed.', {
        variant: 'error',
      })
    }
  }, [segmentedImage, enqueueSnackbar])
  const handleClose = useCallback(() => {
    const { reset } = useAppStore.getState()
    const { result } = useSegementStore.getState()
    if (result) {
      reset()
    } else {
      // force reset segment
      location.reload()
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Box className="absolute inset-0">
        {segmentedImage ? <TextureBackground className="bg-white" /> : null}
        <Box className="relative z-0 flex flex-col w-full h-full">
          <AppBar className="bg-transparent" position="fixed" elevation={0}>
            <Toolbar>
              <CloseButton className="mr-4" onClick={handleClose} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Crop (1/2)
              </Typography>
              {segmentedImage ? (
                <SaveButton
                  icon={<DoneAllOutlinedIcon />}
                  onClick={handleSave}
                />
              ) : null}
            </Toolbar>
          </AppBar>
          <LiveCropper />
          <BottomBar />
        </Box>
        <SegementAlert />
      </Box>
    </ThemeProvider>
  )
}
