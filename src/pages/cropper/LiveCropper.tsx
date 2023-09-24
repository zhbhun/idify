import { useCallback } from 'react'
import EaseCropper, { Area } from 'react-easy-crop'
import Box from '@mui/material/Box'
import { CROPPER_ZOOM_MAX, CROPPER_ZOOM_MIN } from '@/config'
import { useAdaptedSize } from '@/hooks'
import { useCropStore, useSegementStore } from '@/stores'

export function LiveCropper() {
  const [image, spec] = useCropStore((state) => [state.image, state.spec])
  const segmentedImage = useSegementStore((state) => state.result)
  const cropSize = useAdaptedSize(spec)
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
      className="absolute inset-0 top-[100px] bottom-[150px]"
      sx={{
        '& .reactEasyCrop_Container': {
          overflow: 'visible',
        },
        '& .reactEasyCrop_CropArea': {
          color: segmentedImage ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
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
