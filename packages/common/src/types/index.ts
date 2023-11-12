export type IDPhotoType =
  | 'identification'
  | 'passport'
  | 'visa'
  | 'driving'
  | 'student'
  | 'generic'
  | 'others'
  | 'custom'

export interface IDPhotoSpec {
  name: string
  type: IDPhotoType
  title: string
  region: string
  zone: string
  flag: string
  dimension: {
    dpi: number,
    width: number
    height: number
    unit: 'mm' | 'cm' | 'inch',
  },
  rules?: {
    size?: number
    minHeadHeight?: number
    minHeadOffset?: number
    maxHeadHeight?: number
    minEyeHeight?: number
    maxEyeHeight?: number
  }
  background: string;
  comment?: string
}

export interface IDPhotoGroup {
  name: string
  title: string
  specs: IDPhotoSpec[]
}
