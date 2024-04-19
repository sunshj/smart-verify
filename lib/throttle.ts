import { useCallback, useEffect, useRef } from 'react'

export default function useThrottle<T extends unknown[], R>(
  fn: (...args: T) => R,
  delay = 2000,
  dep: unknown[] = []
): (...args: T) => R {
  const { current } = useRef<{ fn: (...args: T) => R; timer: NodeJS.Timeout | null }>({
    fn,
    timer: null
  })

  useEffect(() => {
    current.fn = fn
  }, [fn])

  return useCallback(function (this: unknown, ...args: T): any {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = null
      }, delay)
      return current.fn.apply(this, args)
    }
  }, dep)
}
