import { create } from 'zustand'
import { throttle } from 'lodash-es'
import imglyRemoveBackground from '@zhbhun/background-removal'

export interface SegmentState {
  /** Fail */
  error: Error | null
  /** Segmenting */
  loading: boolean
  progress: number
  /**
   * - 0: idle
   * - 1: downloading
   * - 2: processing
   */
  step: 0 | 1 | 2
  /** Segment result */
  result: string
}

export interface SegmentActions {
  process(file: File | string): Promise<string>
  clear(): void
  reset(): void
}

export interface SegmentStore extends SegmentState, SegmentActions {}

export const defaultSegementState: SegmentState = {
  error: null,
  loading: false,
  progress: 0,
  step: 0,
  result: '',
}

/** AI Model already downloaded */
let downloaded = false
let interval = 0
let onProgress: (key: string, current: number, total: number) => void = () => {}

export const useSegementStore = create<SegmentStore>((set, get) => ({
  ...defaultSegementState,
  process(file: File | string) {
    get().clear()
    window.gtag('event', 'click', {
      object: 'background_remove',
    })
    set({
      loading: true,
      progress: 0,
      step: downloaded ? 2 : 1,
    })
    let lastProgress = 0
    let lastDownloadKey = ''
    const startTime = Date.now()
    onProgress = throttle((key: string, current: number, total: number) => {
      if (!get().loading) {
        return
      }
      if (!downloaded) {
        if (key !== lastDownloadKey && lastDownloadKey) {
          lastProgress += Math.floor(100 * (1 / 6))
        }
        set({
          progress:
            lastProgress + Math.floor(100 * (current / total) * (1 / 6)),
        })
        lastDownloadKey = key
      }
      if (key === 'compute:inference') {
        downloaded = true
        set({
          step: 2,
        })
        if (current === 1) {
          if (interval) {
            clearInterval(interval)
            interval = 0
          }
        } else if (!interval) {
          interval = setInterval(() => {
            if (get().loading) {
              set({
                progress: Math.min(
                  lastProgress +
                    (100 - lastProgress) *
                      ((Date.now() - startTime) / (30 * 1000)),
                  99
                ),
              })
            } else {
              get().clear()
            }
          }, 1000)
        }
      }
    }, 1000)
    return imglyRemoveBackground(file, {
      publicPath: import.meta.env.DEV
        ? '/node_modules/@zhbhun/background-removal/dist/'
        : 'https://unpkg.com/@zhbhun/background-removal@1.0.6/dist/',
      progress: onProgress,
    })
      .then((blob) => {
        window.gtag('event', 'click', {
          object: 'background_remove_success',
          duration: Date.now() - startTime,
        })
        const url = URL.createObjectURL(blob)
        set({
          error: null,
          loading: false,
          result: url,
        })
        return url
      })
      .catch((error) => {
        window.gtag('event', 'click', {
          object: 'background_remove_fail',
          duration: Date.now() - startTime,
        })
        set({
          error,
          loading: false,
        })
        throw error
      })
  },
  clear() {
    if (interval) {
      clearInterval(interval)
      interval = 0
    }
  },
  reset() {
    get().clear()
    set(defaultSegementState)
  },
}))
