import { create } from 'zustand'
import { ID_PHOTO_SPECS } from '@/config'
import { IDPhotoSpec } from '@/types'

export interface CropState {
  image: string
  spec: IDPhotoSpec
  position: { x: number; y: number }
  flipHorizontal: boolean
  flipVertical: boolean
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
  setSpec(spec: IDPhotoSpec): void
  setImage(image: string): void
  setPosition(position: CropState['position']): void
  setFlipHorizontal(flipHorizontal: boolean): void
  setFlipVertical(flipVertical: boolean): void
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
  spec: ID_PHOTO_SPECS[0],
  image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1080&q=80',
  position: {
    x: 0,
    y: 0,
  },
  flipHorizontal: false,
  flipVertical: false,
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
  setSpec(spec: IDPhotoSpec) {
    set({ spec })
  },
  setImage(image: string) {
    set({ ...defaultCropState, image, spec: get().spec })
  },
  setPosition(position) {
    set({ position })
  },
  setFlipHorizontal(flipHorizontal: boolean) {
    set({ flipHorizontal })
  },
  setFlipVertical(flipVertical: boolean) {
    set({ flipVertical })
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
