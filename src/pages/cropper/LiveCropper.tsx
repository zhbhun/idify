import { useCallback, useMemo } from 'react'
import { useMeasure } from 'react-use'
import EaseCropper, { Area } from 'react-easy-crop'
import Box from '@mui/material/Box'
import { CROPPER_ZOOM_MAX, CROPPER_ZOOM_MIN } from '@/config'
import { useAdaptedSize } from '@/hooks'
import { useCropStore, useSegementStore } from '@/stores'

export function LiveCropper() {
  const [measureRef, measureRect] = useMeasure<HTMLDivElement>()
  const [image, spec] = useCropStore((state) => [state.image, state.spec])
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
        image={segmentedImage || image}
        aspect={spec.resolution.width / spec.resolution.height}
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
