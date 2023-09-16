import classNames from 'classnames'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import { useAppStore, useSegementStore } from '@/stores'
import { useCallback } from 'react'
import { useSnackbar } from 'notistack'

const DEMOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?auto=format&fit=crop&w=1080&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1080&q=80',
]

export function ImageAdd() {
  const { enqueueSnackbar } = useSnackbar()
  const [addSource, addSegmented] = useAppStore((state) => [
    state.addSource,
    state.addSegmented,
  ])
  const { process, reset } = useSegementStore()
  const handleAdd = useCallback(
    (file: string) => {
      reset()
      process(file)
        .then((result) => {
          addSegmented(result)
        })
        .catch(() => {
          enqueueSnackbar('Oops, remove image background failed', {
            variant: 'error',
          })
        })
      addSource(file)
    },
    [addSource, addSegmented, process, reset, enqueueSnackbar]
  )

  return (
    <Box className="relative">
      <AddPhotoAlternateIcon className="block text-8xl text-white" />
      <input
        className="absolute z-1 inset-0 opacity-0 cursor-pointer"
        type="file"
        accept="image/jpg,image/jpeg,image/png"
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
