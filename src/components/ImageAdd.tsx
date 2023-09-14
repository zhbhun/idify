import classNames from 'classnames'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const DEMOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2864&q=80',
  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?auto=format&fit=crop&w=2787&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=2940&q=80',
]

export interface ImageAddProps {
  loading?: boolean
  progress?: number
  step?: number
  onAdd?(file: string): void
}

export function ImageAdd({
  loading = false,
  progress = 0,
  step = 0,
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
      {loading ? (
        <Typography
          className="absolute -bottom-[10px] left-1/2 w-[200%] text-center text-gray-100 -translate-x-1/2 translate-y-full"
          variant="caption"
          display="block"
        >
          {step === 1 ? 'AI model downloading ...' : 'Image processing...'}
        </Typography>
      ) : (
        <AvatarGroup
          className={classNames(
            'absolute -bottom-[10px] left-1/2 -translate-x-1/2 translate-y-full'
          )}
        >
          {DEMOS.map((item, index) => {
            return (
              <Avatar
                key={index}
                className="cursor-pointer"
                sx={{ width: 28, height: 28 }}
                src={item}
                onClick={() => {
                  onAdd?.(item)
                }}
              />
            )
          })}
        </AvatarGroup>
      )}
    </Box>
  )
}

export default ImageAdd
