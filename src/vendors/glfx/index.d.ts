export interface FxTexture {
  destroy(): void;
}

export interface FxCanvasElement extends HTMLCanvasElement {
  texture(image: HTMLElement): FxTexture
  draw(texture: FxTexture): FxCanvasElement
  ink(value: number): FxCanvasElement
  brightnessContrast(brightness: number, contrast: number): FxCanvasElement
  curves(
    red: [number, number][],
    green: [number, number][],
    blue: [number, number][]
  ): FxCanvasElement
  denoise(exponent: number): FxCanvasElement
  noise(amount: number): FxCanvasElement
  hueSaturation(hue: number, saturation: number): FxCanvasElement
  sepia(amount: number): FxCanvasElement
  unsharpMask(radius: number, strength: numebr): FxCanvasElement
  vibrance(amount: number): FxCanvasElement
  vignette(size: number, amount: number): FxCanvasElement
  lensBlur(radius: number, brightness: number, angle: number): FxCanvasElement
  dotScreen(centerX: number, centerY: number, angle: number, size: number): FxCanvasElement
  tiltShift(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    blurRadius: number,
    gradientRadius: number
  ): FxCanvasElement
  update(): FxCanvasElement
  destroy(): void
}

interface Glfx {
  canvas(): FxCanvasElement
}

const fx: Glfx

export default fx
