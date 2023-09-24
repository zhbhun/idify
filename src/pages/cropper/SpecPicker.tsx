import { useEffect, useState } from 'react'
import FaceIcon from '@mui/icons-material/Face'
import Face2Icon from '@mui/icons-material/Face2'
import Face3Icon from '@mui/icons-material/Face3'
import Face4Icon from '@mui/icons-material/Face4'
import Face5Icon from '@mui/icons-material/Face5'
import Face6Icon from '@mui/icons-material/Face6'
import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { IDPhotoSpec } from '@/types'
import { ID_PHOTO_SPECS } from '@/config'

const SPEC_ICONS = [
  <FaceIcon />,
  <Face2Icon />,
  <Face3Icon />,
  <Face4Icon />,
  <Face5Icon />,
  <Face6Icon />,
]

export interface SpecPickerProps {
  value: IDPhotoSpec
  onPick?(value: IDPhotoSpec): void
}

export function SpecPicker({ value, onPick }: SpecPickerProps) {
  const [width, setWidth] = useState(value.resolution.width)
  const [widthInput, setWidthInput] = useState(String(width))
  const [height, setHeight] = useState(value.resolution.height)
  const [heightInput, setHeightInput] = useState(String(height))
  useEffect(() => {
    setWidthInput(String(width))
  }, [width])
  useEffect(() => {
    setHeightInput(String(height))
  }, [height])
  return (
    <Card elevation={0}>
      <Box className="flex justify-between items-center py-[10px] px-[15px]">
        <OutlinedInput
          required
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
          startAdornment={<span>W&nbsp;</span>}
          size="small"
          type="number"
          value={widthInput}
          onChange={(e) => {
            setWidthInput(e.target.value)
          }}
          onBlur={(e) => {
            const newWidth = Number(e.target.value)
            if (newWidth > 1000) {
              setWidth(1000)
            } else if (newWidth < 100) {
              setWidth(100)
            } else {
              setWidth(newWidth)
            }
          }}
        />
        <OutlinedInput
          className="ml-[10px]"
          required
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
          startAdornment={<span>H&nbsp;</span>}
          size="small"
          type="number"
          value={heightInput}
          onChange={(e) => {
            setHeightInput(e.target.value)
          }}
          onBlur={(e) => {
            const newHeight = Number(e.target.value)
            if (newHeight > 1000) {
              setHeight(1000)
            } else if (newHeight < 100) {
              setHeight(100)
            } else {
              setHeight(newHeight)
            }
          }}
        />
        <IconButton
          className="ml-[5px]"
          onClick={() => {
            onPick?.({
              name: 'cusotm',
              title: 'Custom',
              aspectRatio: width / height,
              resolution: {
                width: width,
                height: height,
              },
              dimension: {
                width: Math.round((width / 300) * 25.4),
                height: Math.round((height / 300) * 25.4),
              },
              color: '#ffffff',
            })
          }}
        >
          <SaveIcon />
        </IconButton>
      </Box>
      <List
        className="max-h-[300px] overflow-y-auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-button': {
            display: 'none',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#666',
            borderRadius: '8px',
            border: '2px solid #666',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#888',
            borderColor: '#888',
          },
          '::-webkit-scrollbar-corner': {
            display: 'none',
          },
        }}
      >
        {ID_PHOTO_SPECS.map((spec, index) => {
          const { name, title, resolution, dimension } = spec
          return (
            <ListItemButton
              key={name}
              selected={value === spec}
              onClick={() => {
                onPick?.(spec)
              }}
            >
              <ListItemIcon>
                {SPEC_ICONS[index % SPEC_ICONS.length]}
              </ListItemIcon>
              <ListItemText
                primary={title}
                secondary={`${resolution.width}*${resolution.height}px | ${dimension.width}*${dimension.height}mm`}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Card>
  )
}

export default SpecPicker
