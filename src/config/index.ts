import { IDPhotoSpec } from '@/types'

export const EDITOR_ZOOM_MIN = 0.1

export const EDITOR_ZOOM_MAX = 10

export const ID_PHOTO_SPECS: IDPhotoSpec[] = [
  {
    name: 'one-inch', 
    title: 'One inch',
    aspectRatio: 295 / 413,
    resolution: {
      width: 295,
      height: 413,
    },
    dimension: {
      width: 25,
      height: 35,
    },
    color: '#ffffff',
  },
  {
    name: 'two-inch',
    title: 'Two inch',
    aspectRatio: 413 / 579,
    resolution: {
      width: 413,
      height: 579,
    },
    dimension: {
      width: 35,
      height: 49,
    },
    color: '#ffffff',
  },
  {
    name: 'large-one-inch',
    title: 'Large one inch',
    aspectRatio: 390 / 567,
    resolution: {
      width: 390,
      height: 567,
    },
    dimension: {
      width: 33,
      height: 48,
    },
    color: '#ffffff',
  },
  {
    name: 'Small-one-inch',
    title: 'Small one inch',
    aspectRatio: 260 / 378,
    resolution: {
      width: 260,
      height: 378,
    },
    dimension: {
      width: 22,
      height: 32,
    },
    color: '#ffffff',
  },
  {
    name: 'large-two-inch',
    title: 'Large two inch',
    aspectRatio: 413 / 626,
    resolution: {
      width: 413,
      height: 626,
    },
    dimension: {
      width: 35,
      height: 53,
    },
    color: '#ffffff',
  },
  {
    name: 'Small-two-inch',
    title: 'Small two inch',
    aspectRatio: 413 / 531,
    resolution: {
      width: 413,
      height: 378,
    },
    dimension: {
      width: 35,
      height: 45,
    },
    color: '#ffffff',
  },
]
