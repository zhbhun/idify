import { create } from 'zustand'
import { ID_PHOTO_SPECS } from '@/config'
import { IDPhotoSpec } from '@/types'
import { useCropStore } from '.'

export interface AppState {
  spec: IDPhotoSpec
  source: string
  segmented: string
  editing: string
}

export interface AppActions {
  addSource(image: string): void
  addSegmented(image: string): void
  setSpec(spec: IDPhotoSpec): void
  addEditing(image: string): void
  cancelEdit(): void
  cancel(): void
}

export const defaultAppState: AppState = {
  spec: ID_PHOTO_SPECS[0],
  source: '',
  segmented: '',
  editing: '',
}

export interface AppStore extends AppState, AppActions {}

export const useAppStore = create<AppStore>((set, get) => ({
  ...defaultAppState,
  addSource(image: string) {
    useCropStore.getState().reset()
    set({
      source: image,
    })
  },
  addSegmented(image: string) {
    set({
      segmented: image,
    })
  },
  addEditing(image: string) {
    set({
      editing: image,
    })
  },
  setSpec(spec: IDPhotoSpec) {
    set({ spec })
  },
  cancelEdit() {
    set({
      editing: '',
    })
  },
  cancel() {
    set({
      source: '',
      segmented: '',
      editing: '',
    })
  },
}))
