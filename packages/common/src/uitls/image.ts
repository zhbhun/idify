import { RetouchAdjustment, RetouchBackground } from '../stores'
import {
  createGLFXCanvas,
  drawCanvasBackground,
  renderGLFXAdjustment,
} from './canvas'

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    // needed to avoid cross-origin issues on CodeSandbox
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

export async function cropIDPhoto({
  image: imageURL,
  area,
  rotation,
  resolution,
}: {
  image: string
  area: {
    x: number
    y: number
    width: number
    height: number
  }
  rotation: number
  resolution: {
    width: number
    height: number
  }
}): Promise<string> {
  const image = await loadImage(imageURL)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return ''
  }
  const rotRad = getRadianAngle(rotation)
  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  )
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight
  ctx.clearRect(0, 0, bBoxWidth, bBoxHeight)
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  // ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)
  // draw rotated image
  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')
  // Set the size of the cropped canvas
  croppedCanvas.width = resolution.width * 3
  croppedCanvas.height = resolution.height * 3
  const croppedCtx = croppedCanvas.getContext('2d')
  if (!croppedCtx) {
    return ''
  }

  croppedCtx.scale(3, 3)
  croppedCtx.clearRect(0, 0, resolution.width, resolution.height)

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    // croppedImage,
    canvas,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    resolution.width,
    resolution.height
  )

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file))
      } else {
        reject(new Error('failed'))
      }
    }, 'image/png')
  })

  function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180
  }
  function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation)

    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    }
  }
}

export async function createIDPhoto({
  image: imageURL,
  background,
  adjustment,
  resolution,
}: {
  image: string
  background: RetouchBackground
  adjustment: RetouchAdjustment
  resolution: {
    width: number
    height: number
  }
}): Promise<Blob | null> {
  const image = await loadImage(imageURL)
  const canvas = document.createElement('canvas')
  canvas.width = resolution.width
  canvas.height = resolution.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  }
  drawCanvasBackground(canvas, background)
  const fxs = createGLFXCanvas(image)
  fxs.canvas.width = image.naturalWidth
  fxs.canvas.height = image.naturalHeight
  renderGLFXAdjustment(fxs.canvas, fxs.texture, adjustment)
  ctx.drawImage(
    fxs.canvas,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    resolution.width,
    resolution.height
  )
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(file)
      } else {
        reject(new Error('failed'))
      }
    }, 'image/png')
  })
}
