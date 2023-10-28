import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ID_PHOTO_GOUPS, ID_PHOTO_SPECS } from '@/config'
import { IDPhotoGroup, IDPhotoSpec } from '@/types'

export interface SpecState {
  group: string
  spec: string
  customs: IDPhotoSpec[]
}

export interface SpecAction {
  setGroup(group: string): void
  setSpec(spec: string): void
  addCustom(spec: IDPhotoSpec): void
  removeCustom(spec: IDPhotoSpec): void
}

export interface SpecStore extends SpecState, SpecAction {}

export const defaultSpecState = {
  group: ID_PHOTO_GOUPS[0].name,
  spec: ID_PHOTO_GOUPS[0].specs[0].name,
  customs: [],
}

export const useSpecStore = create(
  persist<SpecStore>(
    (set) => ({
      ...defaultSpecState,
      setGroup(group) {
        set({ group })
      },
      setSpec(spec) {
        set({ spec })
      },
      addCustom(spec) {
        set((prevState) => ({
          ...prevState,
          customs: [spec, ...prevState.customs],
        }))
      },
      removeCustom(spec) {
        set((prevState) => {
          const customs = prevState.customs.slice()
          const index = customs.indexOf(spec)
          if (index >= 0) {
            customs.splice(index, 1)
          }
          return {
            ...prevState,
            customs,
          }
        })
      },
    }),
    {
      name: 'idify_spec',
    }
  )
)

export function getSelectedSpec() {
  const selected = useSpecStore.getState().spec
  return (
    ID_PHOTO_SPECS.filter((item) => item.name === selected)[0] ||
    ID_PHOTO_GOUPS[0].specs[0]
  )
}

export function useSelectedSpec() {
  const [selected, setSpec] = useSpecStore((state) => [
    state.spec,
    state.setSpec,
  ])
  return [
    ID_PHOTO_SPECS.filter((item) => item.name === selected)[0] ||
      ID_PHOTO_GOUPS[0].specs[0],
    (newSpec: IDPhotoSpec) => {
      setSpec(newSpec.name)
    },
  ] as [IDPhotoSpec, (spec: IDPhotoSpec) => void]
}
