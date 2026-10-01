import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  getSelectedSpec,
  useAppStore,
  useCropStore,
  useRetouchStore,
  useSpecStore,
} from '../../stores'
import { createIDPhoto, createPrintSheet } from '../../uitls'
import {
  CloseButton,
  ConfigContext,
  SaveButton,
  TextureBackground,
} from '../../components'
import ImagePreview from './ImagePreview'
import BottomBar from './BottomBar'

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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  // Sheets run to several megabytes, so don't leak the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export interface ImageRetouchProps {}

export default function ImageRetouch(props: ImageRetouchProps) {
  const intl = useIntl()
  const config = useContext(ConfigContext)
  const { enqueueSnackbar } = useSnackbar()
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
      const spec = getSelectedSpec()
      const { image, background, adjustment } = useRetouchStore.getState()
      const idPhoto = await createIDPhoto({
        image,
        background,
        adjustment,
        resolution: spec.dimension,
      })
      if (!idPhoto) {
        return
      }
      if (config.savePhoto) {
        await config.savePhoto(idPhoto)
      } else {
        downloadBlob(idPhoto, 'idphoto.png')
      }
      window.gtag?.('event', 'click', {
        object: 'save_success',
      })
      enqueueSnackbar('Save successfully!', {
        variant: 'success',
      })
    } catch (error) {
      window.gtag?.('event', 'click', {
        object: 'save_fail',
      })
      enqueueSnackbar('Save failed.', {
        variant: 'error',
      })
    }
  }, [config, enqueueSnackbar])
  const handlePrintSheet = useCallback(async () => {
    try {
      window.gtag?.('event', 'click', {
        object: 'print_sheet',
      })
      const spec = getSelectedSpec()
      const { image, background, adjustment } = useRetouchStore.getState()
      const sheet = await createPrintSheet({
        image,
        background,
        adjustment,
        dimension: spec.dimension,
      })
      if (!sheet) {
        enqueueSnackbar(
          intl.formatMessage({
            id: 'printSheetTooLarge',
            defaultMessage:
              'This photo size is too large to fit on a 4x6 inch sheet.',
          }),
          { variant: 'warning' }
        )
        return
      }
      // Name and label the sheet with the spec it was built from, so a wrong
      // selection is obvious before it reaches the printer.
      const mm = {
        width: (spec.dimension.width / spec.dimension.dpi) * 25.4,
        height: (spec.dimension.height / spec.dimension.dpi) * 25.4,
      }
      const sizeLabel = `${Math.round(mm.width)}x${Math.round(mm.height)}mm`
      if (config.savePhoto) {
        await config.savePhoto(sheet.blob)
      } else {
        downloadBlob(
          sheet.blob,
          `idphoto-4x6-${sizeLabel}-${sheet.layout.count}up.png`
        )
      }
      window.gtag?.('event', 'click', {
        object: 'print_sheet_success',
      })
      enqueueSnackbar(
        intl.formatMessage(
          {
            id: 'printSheetSaved',
            defaultMessage:
              '4x6 sheet: {count} x {title} ({size}), {columns}x{rows} at {dpi} DPI.',
          },
          {
            count: sheet.layout.count,
            title: spec.title,
            size: sizeLabel,
            columns: sheet.layout.columns,
            rows: sheet.layout.rows,
            dpi: sheet.layout.dpi,
          }
        ),
        { variant: 'success' }
      )
    } catch (error) {
      window.gtag?.('event', 'click', {
        object: 'print_sheet_fail',
      })
      enqueueSnackbar(
        intl.formatMessage({
          id: 'printSheetFailed',
          defaultMessage: 'Could not create the print sheet.',
        }),
        { variant: 'error' }
      )
    }
  }, [config, enqueueSnackbar, intl])
  return (
    <ThemeProvider theme={theme}>
      <Box className="absolute inset-0">
        <TextureBackground className="bg-white" />
        <Box className="relative z-0 flex flex-col w-full h-full">
          <AppBar className="bg-transparent" position="fixed" elevation={0}>
            <Toolbar>
              <CloseButton
                className="mr-4"
                icon={<ArrowBackOutlinedIcon />}
                onClick={handleClose}
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {intl.formatMessage({ id: 'retouch' })} (2/2)
              </Typography>
              <SaveButton
                className="mr-3"
                icon={<PrintOutlinedIcon />}
                title={intl.formatMessage({
                  id: 'printSheet',
                  defaultMessage: '4x6 inch sheet',
                })}
                onClick={handlePrintSheet}
              />
              <SaveButton onClick={handleSave} />
            </Toolbar>
          </AppBar>
          <ImagePreview />
          <BottomBar />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
