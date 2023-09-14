import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BlobAnimation, { BlobAnimationInstance } from './BlobAnimation'
import ImageAdd from './ImageAdd'
import GithubLink from './GithubLink'
import WaveSea from './WaveSea'
import { useSegement } from '@/hooks'

export interface WelcomeProps {
  image?: string
  onAdd?(image: string): void
  onSegmented?(image: string): void
}

export function Welcome({ image, onAdd, onSegmented }: WelcomeProps) {
  const blobAnimationRef = useRef<BlobAnimationInstance>(null)
  const { loading, process, progress, result, step } = useSegement()
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: image ? 'segment' : 'welcome',
    })
  }, [image])
  useEffect(() => {
    if (image) {
      process(image)
    }
  }, [process, image])
  useEffect(() => {
    if (loading) {
      blobAnimationRef.current?.startAnimation({
        minMultiplier: 30,
        deltaMultiplierStep: 0.01,
      })
    }
  }, [loading])
  useEffect(() => {
    if (result) {
      onSegmented?.(result)
    }
  }, [result, onSegmented])
  return (
    <Box
      className="absolute inset-0 flex flex-col overflow-hidden"
      sx={{
        '--blob-color': '#7dd3fc',
        '--center-blob-opacity': '0.3',
      }}
    >
      <BlobAnimation ref={blobAnimationRef}>
        {(props) => (
          <>
            <GithubLink />
            <Box className="h-16 min-h-[50px] grow" />
            <Typography
              className="relative z-0 text-4xl font-bold text-sky-900"
              sx={{
                fontFamily: 'Caveat, cursive',
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
            <Box
              {...props}
              className="relative flex self-center flex-col items-center justify-center shrink-0 w-[400px] h-[400px] max-w-[100vw] max-h-[100vw]"
            >
              <ImageAdd
                loading={loading}
                progress={progress || 50}
                step={step}
                onAdd={onAdd}
              />
            </Box>
            <Box className="h-16 grow" />
            <WaveSea />
          </>
        )}
      </BlobAnimation>
    </Box>
  )
}

export default Welcome
