import Box from '@mui/material/Box'
import { animated, useSpring } from '@react-spring/web'
import WELCOME_PIC_WAVE from '../assets/welcome_pic_wave.svg'

export interface WaveSeaProps {
  visible?: boolean
}

export function WaveSea({ visible }: WaveSeaProps) {
  const [springs] = useSpring(
    {
      config: { duration: 300 },
      from: { y: '100%' },
      to: { y: visible ? '0%' : '100%' },
    },
    [visible]
  )

  const wave = (
    <Box
      className=""
      sx={{
        position: 'absolute',
        top: '-198px',
        width: '6400px',
        height: '198px',
        background: `url("${WELCOME_PIC_WAVE}")`,
        animation: 'wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite',
        transform: 'translate3d(0, 0, 0)',
        '&:nth-of-type(2)': {
          top: '-175px',
          animation:
            'wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite, swell 7s ease -1.25s infinite',
          opacity: '1',
        },
        '@keyframes wave': {
          '0%': {
            marginLeft: '0',
          },
          '100%': {
            marginLeft: '-1600px',
          },
        },
        '@keyframes swell': {
          '0%': {
            transform: 'translate3d(0, -25px, 0)',
          },
          '50%': {
            transform: 'translate3d(0, 5px, 0)',
          },
          '100%': {
            transform: 'translate3d(0, -25px, 0)',
          },
        },
      }}
    />
  )
  return (
    <animated.div
      className="relative grow-[4] shrink-0 h-[220px]"
      style={springs}
    >
      <Box
        className="absolute inset-x-0 bottom-0 bg-blue-400"
        sx={{
          height: 'calc(100% - 200px)',
        }}
      >
        {wave}
        {wave}
      </Box>
    </animated.div>
  )
}

export default WaveSea
