import { IDPhotoSpec } from '../types'

const MM_PER_INCH = 25.4

export interface HeadGuideMetrics {
  /** Photo height in millimetres. */
  photoHeightMm: number
  /** Smallest permitted chin-to-crown height, in mm. */
  minHeadMm: number
  /** Largest permitted chin-to-crown height, in mm, or 0 when unbounded. */
  maxHeadMm: number
  /** Required clear space above the crown, in mm. */
  crownOffsetMm: number
  /** The same values as fractions of the photo height. */
  minHead: number
  maxHead: number
  crownOffset: number
}

/**
 * Resolve a spec's head-position rules into millimetres. Rules are stored as
 * fractions of the photo height; physical size is pixels over the dpi they
 * were authored at.
 */
export function getHeadGuideMetrics(spec: IDPhotoSpec): HeadGuideMetrics | null {
  const rules = spec.rules
  if (!rules) {
    return null
  }
  const { minHeadHeight = 0, maxHeadHeight = 0, minHeadOffset = 0 } = rules
  if (minHeadHeight <= 0 && maxHeadHeight <= 0) {
    return null
  }
  const photoHeightMm =
    (spec.dimension.height / spec.dimension.dpi) * MM_PER_INCH
  return {
    photoHeightMm,
    minHeadMm: minHeadHeight * photoHeightMm,
    maxHeadMm: maxHeadHeight * photoHeightMm,
    crownOffsetMm: minHeadOffset * photoHeightMm,
    minHead: minHeadHeight,
    maxHead: maxHeadHeight,
    crownOffset: minHeadOffset,
  }
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

/**
 * An SVG overlay showing where the head must sit: a crown line, the band the
 * chin must land in, and head outlines at the smallest and largest permitted
 * chin-to-crown heights. Returned as a data URL for use as a background image.
 *
 * The construction assumes the crown is placed on the crown line, which is the
 * tightest legal position; with the crown there, a chin inside the band is
 * always within the permitted range.
 */
export function createHeadGuideSVG(
  spec: IDPhotoSpec,
  size: { width: number; height: number }
): string {
  const metrics = getHeadGuideMetrics(spec)
  if (!metrics || size.width <= 0 || size.height <= 0) {
    return ''
  }
  const { width, height } = size
  const crownY = metrics.crownOffset * height
  const minH = metrics.minHead * height
  const maxH = (metrics.maxHead || metrics.minHead) * height
  const chinMinY = crownY + minH
  const chinMaxY = crownY + maxH
  const cx = width / 2
  // Heads are roughly three quarters as wide as they are tall.
  const ellipse = (headHeight: number, opacity: number) =>
    `<ellipse cx="${cx}" cy="${crownY + headHeight / 2}" rx="${
      (headHeight * 0.75) / 2
    }" ry="${headHeight / 2}" fill="none" stroke="rgba(255,255,255,${opacity})" stroke-width="1"/>`

  const font = Math.max(9, Math.min(13, height * 0.028))
  const label = (y: number, text: string, anchor: 'start' | 'end') =>
    `<text x="${anchor === 'start' ? 6 : width - 6}" y="${y}" fill="rgba(255,255,255,0.95)" font-family="sans-serif" font-size="${font}" text-anchor="${anchor}" paint-order="stroke" stroke="rgba(0,0,0,0.55)" stroke-width="2.5">${text}</text>`

  const hasRange = metrics.maxHead > 0 && metrics.maxHead > metrics.minHead
  const headLabel = hasRange
    ? `${round(metrics.minHeadMm)}-${round(metrics.maxHeadMm)} mm`
    : `min ${round(metrics.minHeadMm)} mm`

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">` +
    // Clear space that must stay above the crown.
    `<rect x="0" y="0" width="${width}" height="${crownY}" fill="rgba(0,0,0,0.28)"/>` +
    // The band the chin must land in.
    (hasRange
      ? `<rect x="0" y="${chinMinY}" width="${width}" height="${
          chinMaxY - chinMinY
        }" fill="rgba(80,220,140,0.22)"/>`
      : '') +
    ellipse(minH, 0.45) +
    (hasRange ? ellipse(maxH, 0.45) : '') +
    // Crown line.
    `<line x1="0" y1="${crownY}" x2="${width}" y2="${crownY}" stroke="rgba(255,255,255,0.85)" stroke-width="1"/>` +
    // Chin limits.
    `<line x1="0" y1="${chinMinY}" x2="${width}" y2="${chinMinY}" stroke="rgba(255,255,255,0.85)" stroke-width="1" stroke-dasharray="4,3"/>` +
    (hasRange
      ? `<line x1="0" y1="${chinMaxY}" x2="${width}" y2="${chinMaxY}" stroke="rgba(255,255,255,0.85)" stroke-width="1" stroke-dasharray="4,3"/>`
      : '') +
    // Centre line, to check the face is square on.
    `<line x1="${cx}" y1="0" x2="${cx}" y2="${height}" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-dasharray="2,4"/>` +
    label(Math.max(font, crownY - 4), 'crown', 'start') +
    label(chinMinY - 4, 'chin', 'start') +
    label(chinMinY - 4, headLabel, 'end') +
    `</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default createHeadGuideSVG
