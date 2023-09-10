import classNames from 'classnames'
import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Typography from '@mui/material/Typography'
import BlobAnimation, { BlobAnimationInstance } from './BlobAnimation'
import ImageAdd from './ImageAdd'
import GithubLink from './GithubLink'
import WaveSea from './WaveSea'
import { useBackgroundRemoval } from '@/hooks'

const DEMOS = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=2940&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2864&q=80',
  'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?auto=format&fit=crop&w=2787&q=80',
]

export interface WelcomeProps {
  onOpen?(image: string): void
}

export function Welcome({ onOpen }: WelcomeProps) {
  const blobAnimationRef = useRef<BlobAnimationInstance>(null)
  const bgRemoval = useBackgroundRemoval()
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'welcome',
    })
  }, [])
  useEffect(() => {
    if (bgRemoval.loading) {
      blobAnimationRef.current?.startAnimation({
        minMultiplier: 100,
        deltaMultiplierStep: 0.05,
      })
    }
  }, [bgRemoval.loading])
  useEffect(() => {
    if (bgRemoval.result) {
      onOpen?.(bgRemoval.result)
    }
  }, [bgRemoval.result, onOpen])
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
            <Box className="h-16 grow" />
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
                loading={bgRemoval.loading}
                progress={bgRemoval.progress}
                onAdd={(file) => {
                  bgRemoval.process(file)
                }}
              />
              <AvatarGroup
                className={classNames(
                  'absolute bottom-[90px] left-1/2 -translate-x-1/2',
                  bgRemoval.loading ? 'invisible' : ''
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
                        bgRemoval.process(item)
                      }}
                    />
                  )
                })}
              </AvatarGroup>
            </Box>
            <Box className="h-16 grow" />
            <WaveSea />
            <GithubLink />
          </>
        )}
      </BlobAnimation>
    </Box>
  )
}

export default Welcome
