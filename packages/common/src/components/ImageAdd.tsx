import classNames from 'classnames'
import { useCallback, useContext } from 'react'
import { useSnackbar } from 'notistack'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import { useAppStore, useSegementStore } from '../stores'
import ConfigContext from './ConfigContext'

const DEMOS = [
  'https://images.unsplash.com/photo-1627161683077-e34782c24d81?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1600878459138-e1123b37cb30?auto=format&fit=crop&w=1080&q=80',
]

export function ImageAdd() {
  const config = useContext(ConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const crop = useAppStore((state) => state.crop)
  const { process: segment } = useSegementStore()
  const handleAdd = useCallback(
    (file: string) => {
      segment(file, config.segment)
        .then((result) => {
          // ignore
        })
        .catch(() => {
          enqueueSnackbar('Oops, remove image background failed', {
            variant: 'error',
          })
        })
      crop(file)
    },
    [crop, segment, enqueueSnackbar, config]
  )

  return (
    <Box className="relative">
      <AddPhotoAlternateIcon className="block text-8xl text-white" />
      <input
        className="absolute z-1 inset-0 opacity-0 cursor-pointer"
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        onClick={(event) => {
          if (config.getPhoto) {
            event.preventDefault()
            config.getPhoto().then(handleAdd)
          }
        }}
        onChange={(event) => {
          const file = event.target?.files?.[0]
          if (file) {
            handleAdd(URL.createObjectURL(file))
          }
        }}
      />
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
                handleAdd(item)
              }}
            />
          )
        })}
      </AvatarGroup>
    </Box>
  )
}

export default ImageAdd
