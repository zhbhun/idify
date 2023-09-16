import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAppStore } from '@/stores'
import BlobAnimation from './BlobAnimation'
import GithubLink from './GithubLink'
import ImageCloud from './ImageCloud'
import LayoutBox from './LayoutBox'
import TextureBackground from './TextureBackground'
import WaveSea from './WaveSea'

export function Welcome() {
  const cloudRef = useRef<HTMLDivElement>(null)
  const [daemon, hidden] = useAppStore((state) => [
    !!state.source,
    state.segmented,
  ])
  const visible = !hidden
  useEffect(() => {
    if (visible) {
      window.gtag?.('event', 'expose', {
        object: 'welcome',
      })
    }
  }, [visible])
  if (hidden) {
    return null
  }
  return (
    <Box
      className="absolute inset-0 flex flex-col overflow-hidden"
      sx={{
        '--blob-color': '#7dd3fc',
        '--center-blob-opacity': '0.3',
      }}
    >
      <TextureBackground />
      <BlobAnimation target={cloudRef} />
      <Box className="h-16 min-h-[50px] grow" />
      <Typography
        className="relative z-0 text-4xl font-bold text-sky-900"
        sx={{
          fontFamily: 'Caveat, cursive',
          visibility: daemon ? 'hidden' : 'visible',
        }}
        variant="h1"
        align="center"
      >
        <img
          className="relative top-[-4px] mr-1 w-12 h-12 align-middle"
          src="/logo.svg"
        />{' '}
        IDIFY
      </Typography>
      <Box className="h-8 grow" />
      <LayoutBox className="self-center shrink-0 w-[400px] h-[400px] max-w-[100vw] max-h-[100vw]">
        {(rect) => <ImageCloud ref={cloudRef} rect={rect} />}
      </LayoutBox>
      <Box className="h-16 grow" />
      <WaveSea visible={!daemon} />
      {!daemon ? <GithubLink /> : null}
    </Box>
  )
}

export default Welcome
