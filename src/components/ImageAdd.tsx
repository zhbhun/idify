import classNames from 'classnames'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export interface ImageAddProps {
  loading?: boolean
  progress?: number
  onAdd?(file: string): void
}

export function ImageAdd({
  loading = false,
  progress = 0,
  onAdd,
}: ImageAddProps) {
  return (
    <Box className="relative">
      <AddPhotoAlternateIcon
        className={classNames(
          'block text-8xl text-white',
          loading ? 'opacity-0' : ''
        )}
      />
      <input
        className="absolute z-1 inset-0 opacity-0 cursor-pointer"
        disabled={loading}
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        onChange={(event) => {
          const file = event.target?.files?.[0]
          if (file) {
            onAdd?.(URL.createObjectURL(file))
          }
        }}
      />
      {loading ? (
        <>
          <CircularProgress
            className="absolute top-[14px] left-[14px] text-white"
            variant="determinate"
            color="info"
            size={68}
            value={progress}
          />
          <Box className="absolute top-1/2 left-1/2 text-white text-xl font-bold -translate-x-1/2 -translate-y-1/2">
            {`${Math.floor(progress)}%`}
          </Box>
        </>
      ) : null}
    </Box>
  )
}

export default ImageAdd
