import classNames from 'classnames'
import { useCallback, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import BlobAnimation, { BlobAnimationInstance } from './BlobAnimation'
import ImageAdd from './ImageAdd'
import WaveSea from './WaveSea'
import { useSegement } from '@/hooks'
import { IconButton } from '@mui/material'

export interface WelcomeProps {
  daemon?: boolean
  source?: string
  onAdd?(image: string): void
  onSegmented?(image: string): void
}

export function Welcome({
  daemon = false,
  source,
  onAdd,
  onSegmented,
}: WelcomeProps) {
  const blobAnimationRef = useRef<BlobAnimationInstance>(null)
  const { error, loading, process, progress, result, step } = useSegement()
  useEffect(() => {
    window.gtag?.('event', 'expose', {
      object: 'welcome',
    })
  }, [])
  useEffect(() => {
    if (loading) {
      blobAnimationRef.current?.startAnimation({
        minMultiplier: 10,
        deltaMultiplierStep: 0.01,
      })
    }
  }, [loading])
  useEffect(() => {
    if (result) {
      onSegmented?.(result)
    }
  }, [result, onSegmented])
  const handleAdd = useCallback(
    (file: string) => {
      process(file)
      onAdd?.(file)
    },
    [process, onAdd]
  )
  const renderAdd = (props: any) => (
    <Box
      {...props}
      key="add"
      className={classNames(
        'flex self-center flex-col items-center justify-center shrink-0 max-w-[100vw] max-h-[100vw]',
        {
          'relativew-[400px] h-[400px]': !daemon,
          'absolute top-[4px] right-[4px] w-[68px] h-[68px]': daemon,
        }
      )}
    >
      {daemon ? (
        !loading && error ? (
          <IconButton
            className="relative z-10 text-white"
            size="small"
            onClick={() => {
              if (source) {
                process(source)
              }
            }}
          >
            <ReplayOutlinedIcon />
          </IconButton>
        ) : (
          <Tooltip
            arrow
            open={loading}
            placement="left"
            title={
              step === 1 ? 'AI模型下载中 ...' : '照片处理中...'
            }
          >
            <Box className="relative z-10">
              <CircularProgress
                className="block text-white"
                variant="determinate"
                color="info"
                size={30}
                value={progress}
              />
              <Box className="absolute top-1/2 left-1/2 text-white text-xs font-bold scale-75 -translate-x-1/2 -translate-y-1/2">
                {`${Math.floor(progress)}%`}
              </Box>
            </Box>
          </Tooltip>
        )
      ) : (
        <ImageAdd
          loading={loading}
          progress={progress}
          step={step}
          onAdd={handleAdd}
        />
      )}
    </Box>
  )
  return (
    <Box
      className="absolute inset-0 flex flex-col overflow-hidden"
      sx={{
        '--blob-color': '#7dd3fc',
        '--center-blob-opacity': '0.3',
      }}
    >
      <BlobAnimation ref={blobAnimationRef}>
        {(props) =>
          daemon ? (
            <>{renderAdd(props)}</>
          ) : (
            <>
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
                证件照制作
              </Typography>
              <Box className="h-8 grow" />
              {renderAdd(props)}
              <Box className="h-16 grow" />
              <WaveSea />
            </>
          )
        }
      </BlobAnimation>
    </Box>
  )
}

export default Welcome
