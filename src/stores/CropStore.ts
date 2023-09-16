import { create } from 'zustand'

export interface CropState {
  position: { x: number; y: number }
  rotation: number
  zoom: number
  area: {
    width: number
    height: number
    x: number
    y: number
  }
}

export interface CropActions {
  setPosition(position: CropState['position']): void
  setRotation(
    rotation:
      | CropState['rotation']
      | ((rotation: CropState['rotation']) => CropState['rotation'])
  ): void
  setZoom(
    zoom: CropState['zoom'] | ((zoom: CropState['zoom']) => CropState['zoom'])
  ): void
  setArea(area: CropState['area']): void
  reset(): void
}

export interface CropStore extends CropState, CropActions {}

export const defaultCropState: CropState = {
  position: {
    x: 0,
    y: 0,
  },
  rotation: 0,
  zoom: 1,
  area: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
}

export const useCropStore = create<CropStore>((set, get) => ({
  ...defaultCropState,
  setPosition(position) {
    set({ position })
  },
  setRotation(rotation) {
    if (typeof rotation === 'function') {
      set({ rotation: rotation(get().rotation) })
    } else {
      set({ rotation })
    }
  },
  setZoom(zoom) {
    if (typeof zoom === 'function') {
      set({ zoom: zoom(get().zoom) })
    } else {
      set({ zoom })
    }
  },
  setArea(area) {
    set({ area })
  },
  reset() {
    set(defaultCropState)
  },
}))
