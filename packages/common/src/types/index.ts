export interface IDPhotoSpec {
  name: string
  title: string
  aspectRatio: number
  resolution: {
    width: number
    height: number
  }
  dimension: {
    width: number
    height: number
  }
  color: string
}
