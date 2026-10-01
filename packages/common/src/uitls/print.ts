import { RetouchAdjustment, RetouchBackground } from '../stores'
import { IDPhotoDimension, renderIDPhotoCanvas } from './image'
import { withPngDensity } from './png'

const MM_PER_INCH = 25.4

/** A 4x6 inch print, the standard photo-lab size. */
export const DEFAULT_SHEET_SIZE_INCH = { width: 4, height: 6 }

export const DEFAULT_SHEET_DPI = 300

export interface PrintSheetLayout {
  columns: number
  rows: number
  /** How many photos fit on the sheet. */
  count: number
  /** Which way round the sheet is, to fit the most photos. */
  orientation: 'portrait' | 'landscape'
  sheetWidthPx: number
  sheetHeightPx: number
  dpi: number
}

export interface CreatePrintSheetOptions {
  image: string
  background: RetouchBackground
  adjustment: RetouchAdjustment
  /**
   * The chosen spec's dimension. `width`/`height` are pixels and `dpi` is the
   * resolution they were authored at, so physical size is width / dpi inches.
   */
  dimension: IDPhotoDimension
  /** Sheet size in inches. Defaults to 4x6. */
  sheetSizeInch?: { width: number; height: number }
  /** Output resolution of the sheet. Defaults to 300. */
  dpi?: number
  /** Unprintable border kept clear at the sheet edges. */
  marginMm?: number
  /** Space between neighbouring photos, for the scissors. */
  gutterMm?: number
  /** Draw hairline cut guides around each photo. */
  cutGuides?: boolean
  /** Paper colour showing through margins and gutters. */
  sheetColor?: string
}

export interface PrintSheet {
  blob: Blob
  layout: PrintSheetLayout
}

export type PlanPrintSheetOptions = Pick<
  CreatePrintSheetOptions,
  'dimension'
> &
  Partial<
    Pick<
      CreatePrintSheetOptions,
      'sheetSizeInch' | 'dpi' | 'marginMm' | 'gutterMm'
    >
  >

export interface PrintSheetPlan extends PrintSheetLayout {
  /** Pixel size of one photo on the sheet. */
  photoW: number
  photoH: number
  margin: number
  gutter: number
}

/** How many `photoW x photoH` cells tile into the printable area. */
function fitGrid(
  sheetW: number,
  sheetH: number,
  photoW: number,
  photoH: number,
  margin: number,
  gutter: number
) {
  const usableW = sheetW - margin * 2
  const usableH = sheetH - margin * 2
  if (photoW <= 0 || photoH <= 0 || usableW < photoW || usableH < photoH) {
    return { columns: 0, rows: 0, count: 0 }
  }
  const columns = Math.floor((usableW + gutter) / (photoW + gutter))
  const rows = Math.floor((usableH + gutter) / (photoH + gutter))
  return { columns, rows, count: columns * rows }
}

/**
 * Work out how to tile a photo across the sheet: which way round to turn the
 * paper, and how many photos fit. Pure arithmetic, no canvas.
 *
 * Only the sheet is ever turned, never the photo: turning the photo 90 degrees
 * on a fixed sheet yields exactly the same count as turning the sheet and
 * leaving the photo upright, so it would only ever duplicate a layout we
 * already consider — while leaving the photos lying on their side.
 */
export function planPrintSheet({
  dimension,
  sheetSizeInch = DEFAULT_SHEET_SIZE_INCH,
  dpi = DEFAULT_SHEET_DPI,
  marginMm = 3,
  gutterMm = 2,
}: PlanPrintSheetOptions): PrintSheetPlan | null {
  // A spec's physical size is its pixel count over the dpi it was authored at.
  const photoWidthInch = dimension.width / dimension.dpi
  const photoHeightInch = dimension.height / dimension.dpi
  if (!(photoWidthInch > 0) || !(photoHeightInch > 0)) {
    return null
  }

  const photoW = Math.round(photoWidthInch * dpi)
  const photoH = Math.round(photoHeightInch * dpi)
  const margin = Math.round((marginMm / MM_PER_INCH) * dpi)
  const gutter = Math.round((gutterMm / MM_PER_INCH) * dpi)
  const shortEdge = Math.round(sheetSizeInch.width * dpi)
  const longEdge = Math.round(sheetSizeInch.height * dpi)

  const candidates = (
    [
      ['portrait', shortEdge, longEdge],
      ['landscape', longEdge, shortEdge],
    ] as const
  ).map(([orientation, sheetW, sheetH]) => ({
    orientation,
    sheetW,
    sheetH,
    ...fitGrid(sheetW, sheetH, photoW, photoH, margin, gutter),
  }))

  // Most photos per sheet wins; on a tie keep the sheet upright.
  const best = candidates.reduce((acc, candidate) =>
    candidate.count > acc.count ? candidate : acc
  )

  if (best.count < 1) {
    // A single photo is larger than the printable area.
    return null
  }

  return {
    columns: best.columns,
    rows: best.rows,
    count: best.count,
    orientation: best.orientation,
    sheetWidthPx: best.sheetW,
    sheetHeightPx: best.sheetH,
    dpi,
    photoW,
    photoH,
    margin,
    gutter,
  }
}

export interface PrintSheetCell {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Where each photo sits on the sheet, as a block centred in the printable
 * area. Pure arithmetic, so the placement can be checked without a canvas.
 */
export function printSheetCells(plan: PrintSheetPlan): PrintSheetCell[] {
  const { columns, rows, photoW, photoH, gutter } = plan
  const gridW = columns * photoW + (columns - 1) * gutter
  const gridH = rows * photoH + (rows - 1) * gutter
  const originX = Math.round((plan.sheetWidthPx - gridW) / 2)
  const originY = Math.round((plan.sheetHeightPx - gridH) / 2)
  const cells: PrintSheetCell[] = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push({
        x: originX + column * (photoW + gutter),
        y: originY + row * (photoH + gutter),
        width: photoW,
        height: photoH,
      })
    }
  }
  return cells
}

/**
 * Tile a finished ID photo across a print sheet (4x6 inches by default),
 * repeated as many times as fit, with cut guides and a true-size DPI tag.
 */
export async function createPrintSheet({
  image,
  background,
  adjustment,
  dimension,
  sheetSizeInch = DEFAULT_SHEET_SIZE_INCH,
  dpi = DEFAULT_SHEET_DPI,
  marginMm = 3,
  gutterMm = 2,
  cutGuides = true,
  sheetColor = '#ffffff',
}: CreatePrintSheetOptions): Promise<PrintSheet | null> {
  const plan = planPrintSheet({
    dimension,
    sheetSizeInch,
    dpi,
    marginMm,
    gutterMm,
  })
  if (!plan) {
    return null
  }
  const { photoW, photoH } = plan

  // Render the photo once at no less than its authored resolution, then let the
  // sheet downscale it, so tiling never softens the image.
  const renderScale = Math.max(1, dimension.width / photoW)
  const photoCanvas = await renderIDPhotoCanvas({
    image,
    background,
    adjustment,
    resolution: {
      width: Math.round(photoW * renderScale),
      height: Math.round(photoH * renderScale),
    },
  })
  if (!photoCanvas) {
    return null
  }

  const sheet = document.createElement('canvas')
  sheet.width = plan.sheetWidthPx
  sheet.height = plan.sheetHeightPx
  const ctx = sheet.getContext('2d')
  if (!ctx) {
    return null
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.fillStyle = sheetColor
  ctx.fillRect(0, 0, sheet.width, sheet.height)

  const guideWidth = Math.max(1, Math.round(dpi / 300))
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)'
  ctx.lineWidth = guideWidth

  printSheetCells(plan).forEach(({ x, y, width, height }) => {
    ctx.drawImage(photoCanvas, x, y, width, height)
    if (cutGuides) {
      // Sits wholly in the gutter so it never marks the photo itself.
      ctx.strokeRect(
        x - guideWidth * 1.5,
        y - guideWidth * 1.5,
        width + guideWidth * 3,
        height + guideWidth * 3
      )
    }
  })

  const blob = await new Promise<Blob>((resolve, reject) => {
    sheet.toBlob((file) => {
      if (file) {
        resolve(file)
      } else {
        reject(new Error('failed'))
      }
    }, 'image/png')
  })

  return {
    blob: await withPngDensity(blob, dpi),
    layout: {
      columns: plan.columns,
      rows: plan.rows,
      count: plan.count,
      orientation: plan.orientation,
      sheetWidthPx: plan.sheetWidthPx,
      sheetHeightPx: plan.sheetHeightPx,
      dpi: plan.dpi,
    },
  }
}

export default createPrintSheet
