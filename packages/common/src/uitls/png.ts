/**
 * Canvas `toBlob` emits PNGs with no physical-density metadata, so print
 * software falls back to its own default (usually 72 or 96 DPI) and lays the
 * image out at the wrong physical size. These helpers inject a `pHYs` chunk so
 * a saved photo or sheet prints at its true dimensions.
 */

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]

const METERS_PER_INCH = 0.0254

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

/** A `pHYs` chunk declaring square pixels at `dpi`. */
function createPhysChunk(dpi: number): Uint8Array {
  const pixelsPerMeter = Math.round(dpi / METERS_PER_INCH)
  // 4 length + 4 type + 9 data + 4 crc
  const chunk = new Uint8Array(21)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, 9)
  chunk[4] = 0x70 // p
  chunk[5] = 0x48 // H
  chunk[6] = 0x59 // Y
  chunk[7] = 0x73 // s
  view.setUint32(8, pixelsPerMeter)
  view.setUint32(12, pixelsPerMeter)
  chunk[16] = 1 // unit specifier: metre
  view.setUint32(17, crc32(chunk.subarray(4, 17)))
  return chunk
}

/**
 * Return a copy of `blob` carrying a `pHYs` density of `dpi`. Any existing
 * `pHYs` is replaced. If the blob is not a PNG we can parse, it is returned
 * untouched rather than corrupted.
 */
export async function withPngDensity(blob: Blob, dpi: number): Promise<Blob> {
  if (!Number.isFinite(dpi) || dpi <= 0) {
    return blob
  }
  const bytes = new Uint8Array(await blob.arrayBuffer())
  if (bytes.length < 8 || PNG_SIGNATURE.some((byte, i) => bytes[i] !== byte)) {
    return blob
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const parts: Uint8Array[] = [bytes.subarray(0, 8)]
  let inserted = false
  let offset = 8
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset)
    const end = offset + 12 + length
    if (end > bytes.length) {
      // Truncated chunk — don't rewrite what we can't read.
      return blob
    }
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7]
    )
    if (type === 'pHYs') {
      offset = end
      continue
    }
    // pHYs must precede the first IDAT.
    if (!inserted && (type === 'IDAT' || type === 'IEND')) {
      parts.push(createPhysChunk(dpi))
      inserted = true
    }
    parts.push(bytes.subarray(offset, end))
    offset = end
  }
  if (!inserted) {
    return blob
  }
  return new Blob(parts as BlobPart[], { type: 'image/png' })
}

export default withPngDensity
