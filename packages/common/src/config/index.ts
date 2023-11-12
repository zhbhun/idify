import { IDPhotoGroup, IDPhotoSpec } from '../types'
import SPEC from './spec.json'

export const CROPPER_ZOOM_MIN = 0.1

export const CROPPER_ZOOM_MAX = 10

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
    value: '#d3d3d3',
  },
  {
    name: 'Gray',
    value: '#808080',
  },
  // blue
  {
    name: 'Blue',
    value: '#0000ff',
  },
  {
    name: 'Pale Blue',
    value: '#add8e6',
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

export const ID_PHOTO_SPECS = SPEC as IDPhotoSpec[]

export const ID_PHOTO_VISA_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'visa'
)

export const ID_PHOTO_GENERIC_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'generic'
)

export const ID_PHOTO_IDENTIFICATION_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'identification'
)

export const ID_PHOTO_PASSPORT_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'passport'
)

export const ID_PHOTO_DRIVING_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'driving'
)

export const ID_PHOTO_STUDENT_SPECS = ID_PHOTO_SPECS.filter(
  (spec) => spec.type === 'student'
)

export const ID_PHOTO_GOUPS = [
  {
    name: 'generic',
    title: 'Generic',
    specs: ID_PHOTO_GENERIC_SPECS,
  },
  {
    name: 'visa',
    title: 'Visa',
    specs: ID_PHOTO_VISA_SPECS,
  },
  {
    name: 'identification',
    title: 'Identification',
    specs: ID_PHOTO_IDENTIFICATION_SPECS,
  },
  {
    name: 'passport',
    title: 'Passport',
    specs: ID_PHOTO_PASSPORT_SPECS,
  },
] as IDPhotoGroup[]
