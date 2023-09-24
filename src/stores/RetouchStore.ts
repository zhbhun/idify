import { create } from 'zustand'

export interface RetouchEffect {
  /**
   * Provides additive brightness control.
   *
   * -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
   */
  brightness?: number
  /**
   * Provides additive multiplicative contrast control.
   *
   * -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
   */
  contrast?: number
  /**
   * Saturation is implemented by scaling all color channel values either toward or away from the average color channel value.
   *
   * -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
   */
  saturation?: number
  /**
   * Adds black and white noise to the image.
   *
   * 0 to 1 (0 for no effect, 1 for maximum noise)
   */
  noise?: number
  /**
   * Gives the image a reddish-brown monochrome tint that imitates an old photograph.
   *
   * 0 to 1 (0 for no effect, 1 for full sepia coloring)
   */
  sepia?: number
  /**
   * Modifies the saturation of desaturated colors, leaving saturated colors unmodified.
   *
   * 1 to 1 (-1 is minimum vibrance, 0 is no change, and 1 is maximum vibrance)
   */
  vibrance?: number
  /** Adds a simulated lens edge darkening effect. */
  vignette?: {
    /** 0 to 1 (0 for center of frame, 1 for edge of frame) */
    size: number
    /** 0 to 1 (0 for no effect, 1 for maximum lens darkening) */
    amount: number
  }
}

export interface RetouchState {
  image: string
  color: string
  gradient: number
  effect: RetouchEffect
}

export interface RetouchActions {
  setImage(image: string): void
  setColor(color: string): void
  setGradient(gradient: number): void
  setEffect(effect: RetouchEffect): void
  setEffect(effect: RetouchEffect): void
  reset(): void
}

export interface RetouchStore extends RetouchState, RetouchActions {}

export const defaultRetouchState: RetouchState = {
  image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=80',
  color: '#ffffff',
  gradient: 0,
  effect: {},
}

export const useRetouchStore = create<RetouchStore>((set, get) => ({
  ...defaultRetouchState,
  setImage(image: string) {
    set({ ...defaultRetouchState, image })
  },
  setColor(color: string) {
    set({ color })
  },
  setGradient(gradient: number) {
    set({ gradient })
  },
  setEffect(effect: RetouchEffect) {
    set({ effect: { ...get().effect, ...effect } })
  },
  reset() {
    set(defaultRetouchState)
  },
}))
