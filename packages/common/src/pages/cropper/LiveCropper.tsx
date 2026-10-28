import { useCallback, useMemo } from 'react'
import { useMeasure } from 'react-use'
import EaseCropper, { Area } from 'react-easy-crop'
import Box from '@mui/material/Box'
import { CROPPER_ZOOM_MAX, CROPPER_ZOOM_MIN } from '../../config'
import { useAdaptedSize } from '../../hooks'
import { useCropStore, useSegementStore, useSelectedSpec } from '../../stores'

export function LiveCropper() {
  const [measureRef, measureRect] = useMeasure<HTMLDivElement>()
  const [spec] = useSelectedSpec()
  const image = useCropStore((state) => state.image)
  const segmentedImage = useSegementStore((state) => state.result)
  const limit = useMemo(
    () => ({
      width: Math.max(measureRect.width - 100, 100),
      height: Math.max(measureRect.height - 100, 100),
    }),
    [measureRect]
  )
  const cropSize = useAdaptedSize(spec, limit)
  const {
    position,
    setPosition,
    rotation,
    setRotation,
    zoom,
    setZoom,
    setArea: setCroppedArea,
    flipHorizontal,
    flipVertical,
  } = useCropStore()
  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels)
    },
    [setCroppedArea]
  )
  const maskImage = useMemo(() => {
    if (spec.rules) {
      const {
        maxHeadHeight = 0,
        minHeadHeight = 0,
        minHeadOffset = 0,
      } = spec.rules
      if (maxHeadHeight > 0 && minHeadOffset > 0) {
        const height = maxHeadHeight * cropSize.height
        const offset = minHeadOffset * cropSize.height
        const innerHeight = minHeadHeight * cropSize.height
        const innsetOffset = offset + (height - innerHeight) / 2
        const cx = cropSize.width / 2
        // A solid black line under white dashes reads as alternating black
        // and white segments, visible on light and dark photos alike.
        const contrast = (shape: (attrs: string) => string) =>
          shape('fill="none" stroke="black" stroke-width="1"') +
          shape(
            'fill="none" stroke="white" stroke-width="1" stroke-dasharray="4,4"'
          )
        const ellipse = (top: number, h: number) =>
          contrast(
            (attrs) =>
              `<ellipse cx="${cx}" cy="${top + h / 2}" rx="${
                (h * (3 / 4)) / 2
              }" ry="${h / 2}" ${attrs}/>`
          )
        return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
          cropSize.width
        } ${cropSize.height}">${ellipse(offset, height)}${
          innerHeight > 0 ? ellipse(innsetOffset, innerHeight) : ''
        }${contrast(
          (attrs) =>
            `<line x1="${cx}" y1="0" x2="${cx}" y2="${cropSize.height}" ${attrs}/>`
        )}</svg>`
      }
    }
    return ''
  }, [spec, cropSize])
  return (
    <Box
      ref={measureRef}
      className="relative flex flex-col justify-center items-center grow pt-[56px]"
      sx={{
        '& .reactEasyCrop_Container': {
          overflow: 'visible',
        },
        '& .reactEasyCrop_CropArea': {
          color: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <EaseCropper
        style={{
          cropAreaStyle: {
            backgroundImage: maskImage ? `url('${maskImage}')` : undefined,
            backgroundSize: '100% 100%',
          },
        }}
        image={segmentedImage || image}
        aspect={spec.dimension.width / spec.dimension.height}
        crop={position}
        cropSize={cropSize}
        rotation={rotation}
        zoom={zoom}
        minZoom={CROPPER_ZOOM_MIN}
        maxZoom={CROPPER_ZOOM_MAX}
        restrictPosition={false}
        showGrid={false}
        transform={[
          `translate(${position.x}px, ${position.y}px)`,
          `rotateZ(${rotation}deg)`,
          `rotateY(${flipHorizontal ? 180 : 0}deg)`,
          `rotateX(${flipVertical ? 180 : 0}deg)`,
          `scale(${zoom})`,
        ].join(' ')}
        onCropChange={setPosition}
        onCropComplete={onCropComplete}
        onRotationChange={setRotation}
        onZoomChange={setZoom}
      />
    </Box>
  )
}

export default LiveCropper
