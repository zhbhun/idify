export type IDPhotoType =
  | 'passport'
  | 'identification'
  | 'visa'
  | 'driving'
  | 'generic'
  | 'custom'
  | 'others'

export interface IDPhotoSpec {
  name: string
  type: IDPhotoType
  title: string
  country: string
  languages?: string[]
  definition?: {
    headHeight: number
    headTop: number
  }
  resolution: {
    dpi: number
    width: number
    height: number
  }
  dimension: {
    width: number
    height: number
    unit: 'inch' | 'mm'
  }
  color: string
  comment?: string
  links?: string[]
}

export interface IDPhotoGroup {
  name: string
  title: string
  specs: IDPhotoSpec[]
}
