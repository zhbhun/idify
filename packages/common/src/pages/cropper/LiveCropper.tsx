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
    if (spec.definition) {
      const height = (spec.definition.headHeight / 100) * cropSize.height
      const offset = (spec.definition.headTop / 100) * cropSize.height
      const innerHeight = height * (5 / 6)
      const innsetOffset = offset + (height - innerHeight) / 2
      return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
        cropSize.width
      } ${cropSize.height}"><ellipse cx="${
        cropSize.width / 2
      }" cy="${offset + height / 2}" rx="${(height * (3 / 4)) / 2}" ry="${
        height / 2
      }" fill="black" fill-opacity="0.01" stroke="white" stroke-width="1" stroke-opacity="0.6"></ellipse><ellipse cx="${
        cropSize.width / 2
      }" cy="${innsetOffset + innerHeight / 2}" rx="${(innerHeight * (3 / 4)) / 2}" ry="${
        innerHeight / 2
      }" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.4"></ellipse><path style="fill:none;stroke:white;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:0.25,0.5;stroke-dashoffset:0;stroke-opacity:0.8" d="m ${
        cropSize.width / 2
      },0 v ${cropSize.height} 0"></path></svg>`
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
