import { useState } from 'react'
import FilterVintageOutlinedIcon from '@mui/icons-material/FilterVintageOutlined'
import GradientIcon from '@mui/icons-material/Gradient'
import PaletteIcon from '@mui/icons-material/Palette'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import BackgroundColorPicker from './BackgroundColorPicker'
import BackgroundGraientPicker from './BackgroundGraientPicker'
import Adjustment from './Adjustment'

type ActiveType = '' | 'color' | 'gradient' | 'adjust' | 'filter'

export function BottomBar() {
  const [active, setActive] = useState<ActiveType>('')
  return (
    <Paper
      className="flex flex-col grow-0 shrink-0 rounded-t-2xl overflow-hidden sm:mx-auto sm:w-[400px]"
      square
      elevation={6}
    >
      {active === 'color' ? <BackgroundColorPicker /> : null}
      {active === 'gradient' ? <BackgroundGraientPicker /> : null}
      {active === 'adjust' ? <Adjustment /> : null}
      {active ? <Divider /> : null}
      <Stack
        className="py-[6px] px-[10px]"
        direction="row"
        justifyContent="space-around"
      >
        <Button
          size="small"
          color={active === 'color' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'color' ? '' : 'color'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <PaletteIcon fontSize="small" />
            <span>Background</span>
          </Stack>
        </Button>
        <Button
          size="small"
          color={active === 'gradient' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) =>
              prevActive === 'gradient' ? '' : 'gradient'
            )
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <GradientIcon fontSize="small" />
            <span>Gradient</span>
          </Stack>
        </Button>
        <Button
          size="small"
          color={active === 'adjust' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'adjust' ? '' : 'adjust'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <TuneOutlinedIcon fontSize="small" />
            <span>Adjust</span>
          </Stack>
        </Button>
        {/* <Button
          size="small"
          color={active === 'filter' ? 'primary' : 'inherit'}
          onClick={() => {
            setActive((prevActive) => (prevActive === 'filter' ? '' : 'filter'))
          }}
        >
          <Stack direction="column" alignItems="center" spacing={0.5}>
            <FilterVintageOutlinedIcon fontSize="small" />
            <span>Filter</span>
          </Stack>
        </Button> */}
      </Stack>
    </Paper>
  )
}

export default BottomBar
