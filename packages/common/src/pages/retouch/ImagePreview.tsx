import { useMemo } from 'react'
import { useMeasure } from 'react-use'
import Box from '@mui/material/Box'
import { useAdaptedSize, useNotEmpty } from '../../hooks'
import { useRetouchStore, useSelectedSpec } from '../../stores'
import { createHeadGuideSVG } from '../../uitls'
import BackgroundPreview from './BackgroundPreview'
import CanvasImage from './CanvasImage'

export function ImagePreview() {
  const [measureRef, measureRect] = useMeasure<HTMLDivElement>()
  const [spec] = useSelectedSpec()
  const image = useNotEmpty(useRetouchStore((state) => state.image))
  const limit = useMemo(
    () => ({
      width: Math.max(measureRect.width - 100, 100),
      height: Math.max(measureRect.height - 100, 100),
    }),
    [measureRect]
  )
  const size = useAdaptedSize(spec, limit)
  const guides = useRetouchStore((state) => state.guides)
  const guideImage = useMemo(
    () => (guides ? createHeadGuideSVG(spec, size) : ''),
    [guides, spec, size]
  )
  return (
    <Box
      ref={measureRef}
      className="relative flex flex-col justify-center items-center grow pt-[56px]"
    >
      <Box
        className="relative"
        sx={{
          color: 'rgba(0, 0, 0, 0.6)',
          outline: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 0 0 9999em',
          width: size.width,
          height: size.height,
        }}
      >
        <BackgroundPreview width={size.width} height={size.height} />
        <CanvasImage image={image} />
        {guides && guideImage ? (
          <Box
            className="absolute inset-0 pointer-events-none"
            sx={{
              backgroundImage: `url('${guideImage}')`,
              backgroundSize: '100% 100%',
            }}
          />
        ) : null}
      </Box>
    </Box>
  )
}

export default ImagePreview
