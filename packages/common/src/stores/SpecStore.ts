import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ID_PHOTO_SPECS,
  ID_PHOTO_GENERIC_SPECS,
  ID_PHOTO_GOUPS,
} from '../config'
import { IDPhotoGroup, IDPhotoSpec } from '../types'
import { getRegion } from '../uitls/intl'

export interface SpecState {
  customs: IDPhotoSpec[]
  groups: IDPhotoGroup[]
  spec: string
}

export interface SpecAction {
  initiate(): Promise<void>
  setSpec(spec: string): void
  addCustom(spec: IDPhotoSpec): void
  updateCustom(spec: IDPhotoSpec): void
  removeCustom(spec: IDPhotoSpec): void
  getNextName(): string
}

export interface SpecStore extends SpecState, SpecAction {}

export const defaultSpecState = {
  spec: ID_PHOTO_GENERIC_SPECS[0].name,
  groups: ID_PHOTO_GOUPS,
  customs: [],
}

export const useSpecStore = create(
  persist<SpecStore>(
    (set, get) => ({
      ...defaultSpecState,
      async initiate() {
        const region = await getRegion()
        if (region) {
          const localeSpecs = ID_PHOTO_SPECS.filter(
            (spec) => spec.zone === region
          )
          if (localeSpecs.length > 0) {
            set({
              groups: [
                {
                  name: 'locale',
                  title: 'Locale',
                  specs: localeSpecs,
                },
                ...ID_PHOTO_GOUPS,
              ],
              spec: localeSpecs[0].name,
            })
          }
        }
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

export function useSpecGroups() {
  return useSpecStore((state) => state.groups)
}

export function getSelectedSpec() {
  const { customs, groups, spec: selected } = useSpecStore.getState()
  return (
    ID_PHOTO_SPECS.filter((item) => item.name === selected)[0] ||
    customs.find((item) => item.name === selected) ||
    groups[0].specs[0]
  )
}

export function useSelectedSpec() {
  const [customs, groups, selected, setSpec] = useSpecStore((state) => [
    state.customs,
    state.groups,
    state.spec,
    state.setSpec,
  ])
  return [
    ID_PHOTO_SPECS.find((item) => item.name === selected) ||
      customs.find((item) => item.name === selected) ||
      groups[0].specs[0],
    (newSpec: IDPhotoSpec) => {
      setSpec(newSpec.name)
    },
  ] as [IDPhotoSpec, (spec: IDPhotoSpec) => void]
}
