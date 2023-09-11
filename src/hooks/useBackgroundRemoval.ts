import { useCallback, useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'
import imglyRemoveBackground from '@zhbhun/background-removal'

let downloaded = false
let onProgress: (key: string, current: number, total: number) => void = () => {}

export function useBackgroundRemoval() {
  const { enqueueSnackbar } = useSnackbar()
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState('')

  const lastProgressRef = useRef(0)
  const lastDownloadKeyRef = useRef('')
  const startTimeRef = useRef(0)
  const intervalRef = useRef(0)

  const handleProgress = useCallback(
    (key: string, current: number, total: number) => {
      if (!downloaded) {
        if (key !== lastDownloadKeyRef.current && lastDownloadKeyRef.current) {
          lastProgressRef.current += Math.floor(100 * (1 / 6))
        }
        setProgress(
          lastProgressRef.current +
            Math.floor(100 * (current / total) * (1 / 6))
        )
        lastDownloadKeyRef.current = key
      }
      if (key === 'compute:inference') {
        downloaded = true
        if (current === 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = 0
          }
          setProgress(100)
        } else if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            setProgress(
              Math.min(
                lastProgressRef.current +
                  (100 - lastProgressRef.current) *
                    ((Date.now() - startTimeRef.current) / (30 * 1000)),
                99
              )
            )
          }, 1000)
        }
      }
    },
    []
  )

  const process = useCallback(
    (file: File | string) => {
      window.gtag('event', 'click', {
        object: 'background_remove',
      })
      setLoading(true)
      setProgress(0)
      lastProgressRef.current = 0
      lastDownloadKeyRef.current = ''
      startTimeRef.current = Date.now()
      onProgress = handleProgress
      imglyRemoveBackground(file, {
        publicPath: import.meta.env.DEV
          ? '/node_modules/@zhbhun/background-removal/dist/'
          : 'https://unpkg.com/@zhbhun/background-removal@1.0.6/dist/',
        progress(key: string, current: number, total: number) {
          onProgress(key, current, total)
        },
      })
        .then((blob) => {
          window.gtag('event', 'click', {
            object: 'background_remove_success',
            duration: Date.now() - startTimeRef.current,
          })
          const url = URL.createObjectURL(blob)
          setError(null)
          setLoading(false)
          setResult(url)
        })
        .catch((error) => {
          window.gtag('event', 'click', {
            object: 'background_remove_fail',
            duration: Date.now() - startTimeRef.current,
          })
          setError(error)
          setLoading(false)
          enqueueSnackbar('Failed', {
            variant: 'error',
          })
        })
    },
    [handleProgress, enqueueSnackbar]
  )
  useEffect(() => {
    return () => {
      onProgress = () => {}
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  return {
    error,
    loading,
    progress,
    result,
    process,
  }
}
