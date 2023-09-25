import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useAppStore, useSegementStore } from '@/stores'
import {
  BlobAnimation,
  GithubLink,
  ImageCloud,
  LayoutBox,
  TextureBackground,
  WaveSea,
} from '@/components'

export default function Welcome() {
  const cloudRef = useRef<HTMLDivElement>(null)
  const step = useAppStore((state) => state.step)
  const daemon = step === 1
  const hidden =
    (useSegementStore((state) => !!state.result) && step >= 1) || step > 1
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
