import { ChromePicker } from 'react-color'
import chroma from 'chroma-js'
import CloseIcon from '@mui/icons-material/Close'
import GradientIcon from '@mui/icons-material/Gradient'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'
import { useEffect, useState } from 'react'

const COLORS = [
  // white
  {
    name: 'Transparent',
    value: 'transparent',
  },
  {
    name: 'White',
    value: '#ffffff',
  },
  {
    name: 'Light White',
    value: '#F5F5F5',
  },
  {
    name: 'Light Sky Blue',
    value: '#f0f8ff',
  },
  {
    name: 'Snow White',
    value: '#fffafa',
  },
  {
    name: 'Light Beige',
    value: '#faf0e6',
  },
  {
    name: 'Frost White',
    value: '#e1e1e1',
  },
  {
    name: 'Light Gray',
    value: '#ececec',
  },
  {
    name: 'Light Gray',
    value: '#d3d3d3',
  },
  // blue
  {
    name: 'Blue',
    value: '#0000ff',
  },
  {
    name: 'Blue',
    value: '#2254f4',
  },
  {
    name: 'Azure',
    value: '#007FFF',
  },
  {
    name: 'Royal Blue',
    value: '#4169E1',
  },
  {
    name: 'Blue',
    value: '#2287f4',
  },
  {
    name: 'Cornflower Blue',
    value: '#6495ED',
  },
  {
    name: 'Sky Blue',
    value: '#87CEEB',
  },
  {
    name: 'Light Blue',
    value: '#add8e6',
  },
  {
    name: 'Light Steel Blue',
    value: '#B0C4DE',
  },
  // red,
  {
    name: 'Red',
    value: '#ff0000',
  },
  {
    name: 'Deep Crimson',
    value: '#c80002',
  },
  {
    name: 'Crimson',
    value: '#DC143C',
  },
  {
    name: 'Coral',
    value: '#FF6F61',
  },
  {
    name: 'Rose',
    value: '#FF007F',
  },
  {
    name: 'Light Salmon',
    value: '#ffa07a',
  },
  {
    name: 'Salmon',
    value: '#ffb6c1',
  },
  {
    name: 'Mint Red',
    value: '#fa8072',
  },
  {
    name: 'Peach',
    value: '#ffdab9',
  },
]

export interface ColorPickerProps {
  open: boolean
  value: string
  gradient: number
  onClose?(): void
  onChange?(value: string): void
  onGradientChange?(gradient: number): void
}

export function ColorPicker({
  open,
  value,
  gradient,
  onClose,
  onChange,
  onGradientChange,
}: ColorPickerProps) {
  const [colorInput, setColorInput] = useState(value)
  useEffect(() => {
    setColorInput(value)
  }, [value])
  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open === true) {
          onClose?.()
        }
      }}
    >
      <Fade appear in={open} timeout={300}>
        <Card
          className="absolute z-1 left-1/2 bottom-0 w-full  -translate-x-1/2 sm:bottom-[60px] sm:w-[300px]"
          sx={{
            '& [tabindex]': {
              outline: '1px solid #d6d6d6 !important',
            },
            '& .chrome-picker input': {
              color: 'inherit !important',
              outline: '1px solid rgba(255, 255, 255, 0.23)',
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              '&:hover': {
                outlineColor: '#fff',
              },
              '&:focus': {
                outlineColor: 'rgb(25, 118, 210)',
              },
            },
            '& .chrome-picker svg': {
              fill: 'currentColor !important',
              background: 'transparent !important',
            },
          }}
          elevation={6}
        >
          <CardHeader
            title="Color Picker"
            action={
              <IconButton
                className="!outline-0"
                size="small"
                type="button"
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Box className="px-4">
              <Box className="grid grid-cols-9 grid-rows-3 gap-[10px] mb-4">
                {COLORS.map((color, index) => {
                  return (
                    <Tooltip key={index} title={color.name} enterDelay={300}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity="0.75"/></svg>')`,
                          backgroundSize: '8px 8px',
                          boxShadow:
                            color.value === value
                              ? `${color.value} 0px 0px 0px 20px inset, ${color.value} 0px 0px 5px`
                              : `${color.value} 0px 0px 0px 20px inset`,
                        }}
                        onClick={() => {
                          onChange?.(color.value)
                        }}
                      >
                        {color.value === value ? (
                          <Box
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-[8px]"
                            sx={{
                              backgroundColor: '#121212',
                              backgroundImage:
                                'linear-gradient(rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.11))',
                            }}
                          />
                        ) : null}
                      </Box>
                    </Tooltip>
                  )
                })}
              </Box>
              <OutlinedInput
                className="mb-4"
                required
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                size="small"
                type="text"
                value={colorInput}
                onChange={(e) => {
                  setColorInput(e.target.value)
                }}
                onBlur={(e) => {
                  const newColor = e.target.value
                  if (chroma.valid(newColor)) {
                    onChange?.(chroma(newColor).hex())
                  } else {
                    setColorInput(value)
                  }
                }}
              />
              <Box className="flex flex-row items-center">
                <GradientIcon fontSize="small" />
                <Box className="grow ml-[20px]">
                  <Slider
                    className="block w-full"
                    min={0}
                    max={10}
                    step={0.1}
                    size="small"
                    value={gradient}
                    onChange={(_, value) => {
                      if (typeof value === 'number') {
                        onGradientChange?.(value as number)
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
          {/* <IconButton
            className="absolute top-0 right-0 !outline-0"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton> */}
        </Card>
      </Fade>
    </ClickAwayListener>
  )
}

export default ColorPicker
