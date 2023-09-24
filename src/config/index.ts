import { IDPhotoSpec } from '@/types'

export const CROPPER_ZOOM_MIN = 0.5

export const CROPPER_ZOOM_MAX = 2

export const BOTTOM_WIDTH_PC = 400

export const BACKGROUND_COLORS = [
  // white
  {
    name: 'Transparent',
    value: 'transparent',
  },
  {
    name: 'White',
    value: '#ffffff',
  },
  {
    name: 'Light White',
    value: '#F5F5F5',
  },
  {
    name: 'Light Sky Blue',
    value: '#f0f8ff',
  },
  {
    name: 'Snow White',
    value: '#fffafa',
  },
  {
    name: 'Light Beige',
    value: '#faf0e6',
  },
  {
    name: 'Frost White',
    value: '#e1e1e1',
  },
  {
    name: 'Light Gray',
    value: '#ececec',
  },
  {
    name: 'Light Gray',
    value: '#d3d3d3',
  },
  // blue
  {
    name: 'Blue',
    value: '#0000ff',
  },
  {
    name: 'Blue',
    value: '#2254f4',
  },
  {
    name: 'Azure',
    value: '#007FFF',
  },
  {
    name: 'Royal Blue',
    value: '#4169E1',
  },
  {
    name: 'Blue',
    value: '#2287f4',
  },
  {
    name: 'Cornflower Blue',
    value: '#6495ED',
  },
  {
    name: 'Sky Blue',
    value: '#87CEEB',
  },
  {
    name: 'Light Blue',
    value: '#add8e6',
  },
  {
    name: 'Light Steel Blue',
    value: '#B0C4DE',
  },
  // red,
  {
    name: 'Red',
    value: '#ff0000',
  },
  {
    name: 'Deep Crimson',
    value: '#c80002',
  },
  {
    name: 'Crimson',
    value: '#DC143C',
  },
  {
    name: 'Coral',
    value: '#FF6F61',
  },
  {
    name: 'Rose',
    value: '#FF007F',
  },
  {
    name: 'Light Salmon',
    value: '#ffa07a',
  },
  {
    name: 'Salmon',
    value: '#ffb6c1',
  },
  {
    name: 'Mint Red',
    value: '#fa8072',
  },
  {
    name: 'Peach',
    value: '#ffdab9',
  },
]

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
