import chroma from 'chroma-js'
import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Input from '@mui/material/Input'
import Tooltip from '@mui/material/Tooltip'
import { BACKGROUND_COLORS } from '@/config'
import { useRetouchStore } from '@/stores'

export function BackgroundColorPicker() {
  const [background, setBackground] = useRetouchStore((state) => [
    state.background,
    state.setBackground,
  ])
  const { color } = background
  const setColor = useCallback(
    (newColor: string) => {
      setBackground({
        ...useRetouchStore.getState().background,
        color: newColor,
      })
    },
    [setBackground]
  )
  const [colorInput, setColorInput] = useState(color)
  useEffect(() => {
    setColorInput(color)
  }, [color])
  return (
    <Card elevation={0}>
      <CardContent>
        <Input
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
              setColor(chroma(newColor).hex())
            } else {
              setColorInput(color)
            }
          }}
        />
        <Box className="grid grid-cols-9 grid-rows-3 gap-[10px]">
          {BACKGROUND_COLORS.map((item, index) => {
            return (
              <Tooltip key={index} title={item.name} enterDelay={300}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2" fill="white"><path d="M1 2V0h1v1H0v1z" fill-opacity="0.75"/></svg>')`,
                    backgroundSize: '8px 8px',
                    boxShadow:
                      item.value === color
                        ? `${item.value} 0px 0px 0px 20px inset, ${item.value} 0px 0px 5px`
                        : `${item.value} 0px 0px 0px 20px inset`,
                  }}
                  onClick={() => {
                    setColor(item.value)
                  }}
                >
                  {item.value === color ? (
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
      </CardContent>
    </Card>
  )
}

export default BackgroundColorPicker
