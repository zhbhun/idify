import chroma from 'chroma-js'
import fx, { FxCanvasElement, FxTexture } from '../vendors/glfx'
import {
  RetouchAdjustment,
  RetouchBackground,
  RetouchBackgroundGradientAngle,
} from '../stores'

export function drawCanvasBackground(
  canvas: HTMLCanvasElement,
  { color, gradient: { angle, brightness } }: RetouchBackground
) {
  if (color === 'transparent') {
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  const { width, height } = canvas
  if (brightness < 0.1 && brightness > -0.1) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else if (angle === 'c') {
    const grd = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      (width + height) / 2
    )
    grd.addColorStop(0, color)
    grd.addColorStop(
      1,
      brightness > 0
        ? chroma(color).brighten(brightness).hex()
        : chroma(color).darken(Math.abs(brightness)).hex()
    )
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)
  } else {
    const grd = ctx.createLinearGradient(
      ...(
        {
          l: [0, height / 2, width, height / 2],
          r: [width, height / 2, 0, height / 2],
          t: [width / 2, 0, width / 2, height],
          b: [width / 2, height, width / 2, 0],
          tl: [0, 0, width, height],
          tr: [0, width, 0, height],
          bl: [0, height, width, 0],
          br: [width, height, 0, 0],
        } as Record<
          RetouchBackgroundGradientAngle,
          [number, number, number, number]
        >
      )[angle]
    )
    grd.addColorStop(0, color)
    grd.addColorStop(
      1,
      brightness > 0
        ? chroma(color).brighten(brightness).hex()
        : chroma(color).darken(Math.abs(brightness)).hex()
    )
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)
  }
}

export function createGLFXCanvas(img: HTMLImageElement) {
  const canvas = fx.canvas()
  const texture = canvas.texture(img)
  return { canvas, texture }
}

export function renderGLFXAdjustment(
  canvas: FxCanvasElement,
  texture: FxTexture,
  adjustment: RetouchAdjustment
) {
  canvas.draw(texture)
  if (
    adjustment.brightness !== undefined ||
    adjustment.contrast !== undefined
  ) {
    canvas.brightnessContrast(
      adjustment.brightness ?? 0,
      adjustment.contrast ?? 0
    )
  }
  if (adjustment.saturation !== undefined) {
    canvas.hueSaturation(0, adjustment.saturation ?? 0)
  }
  if (adjustment.noise !== undefined) {
    canvas.noise(adjustment.noise)
  }
  if (adjustment.sepia !== undefined) {
    canvas.sepia(adjustment.sepia)
  }
  if (adjustment.vibrance !== undefined) {
    canvas.vibrance(adjustment.vibrance)
  }
  canvas.update()
}
