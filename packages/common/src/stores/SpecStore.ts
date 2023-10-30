import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ID_PHOTO_GOUPS, ID_PHOTO_SPECS } from '../config'
import { IDPhotoSpec } from '../types'

export interface SpecState {
  spec: string
  customs: IDPhotoSpec[]
}

export interface SpecAction {
  setSpec(spec: string): void
  addCustom(spec: IDPhotoSpec): void
  updateCustom(spec: IDPhotoSpec): void
  removeCustom(spec: IDPhotoSpec): void
  getNextName(): string
}

export interface SpecStore extends SpecState, SpecAction {}

export const defaultSpecState = {
  spec: ID_PHOTO_GOUPS[0].specs[0].name,
  customs: [],
}

export const useSpecStore = create(
  persist<SpecStore>(
    (set, get) => ({
      ...defaultSpecState,
      setSpec(spec) {
        set({ spec })
      },
      addCustom(spec) {
        set((prevState) => ({
          ...prevState,
          customs: [spec, ...prevState.customs],
        }))
      },
      updateCustom(spec: IDPhotoSpec): void {
        set((prevState) => {
          return {
            ...prevState,
            customs: prevState.customs.map((item) => {
              if (item.name === spec.name) {
                return {
                  ...item,
                  ...spec,
                }
              }
              return item
            }),
          }
        })
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
      getNextName() {
        const { customs } = get()
        let maxId = 0
        for (let index = 0; index < customs.length; index++) {
          const id = Number(customs[index].name.split('_')[1])
          if (id > maxId) {
            maxId = id
          }
        }
        return `custom_${maxId}`
      },
    }),
    {
      name: 'idify_spec',
    }
  )
)

export function getSelectedSpec() {
  const { customs, spec: selected } = useSpecStore.getState()
  return (
    ID_PHOTO_SPECS.filter((item) => item.name === selected)[0] ||
    customs.find((item) => item.name === selected) ||
    ID_PHOTO_GOUPS[0].specs[0]
  )
}

export function useSelectedSpec() {
  const [customs, selected, setSpec] = useSpecStore((state) => [
    state.customs,
    state.spec,
    state.setSpec,
  ])
  return [
    ID_PHOTO_SPECS.find((item) => item.name === selected) ||
      customs.find((item) => item.name === selected) ||
      ID_PHOTO_GOUPS[0].specs[0],
    (newSpec: IDPhotoSpec) => {
      setSpec(newSpec.name)
    },
  ] as [IDPhotoSpec, (spec: IDPhotoSpec) => void]
}
