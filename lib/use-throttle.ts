import { useCallback, useEffect, useRef } from 'react'

type ThrottledFunction<T extends unknown[]> = (...args: T) => void

export default function useThrottle<T extends unknown[]>(
  fn: ThrottledFunction<T>,
  delay = 2000,
  dep: unknown[] = []
) {
  const { current } = useRef<{ fn: ThrottledFunction<T>; timer: NodeJS.Timeout | null }>({
    fn,
    timer: null
  })

  useEffect(() => {
    current.fn = fn
  }, [fn])

  return useCallback(function (this: unknown, ...args: T) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = null
      }, delay)
      current.fn.apply(this, args)
    }
  }, dep)
}
