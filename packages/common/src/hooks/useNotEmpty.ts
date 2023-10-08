import { useEffect, useRef } from 'react'

export function useNotEmpty<T>(value: T) {
  const valueRef = useRef(value)
  if (value) {
    valueRef.current = value
  }
  return valueRef.current
}

export default useNotEmpty
