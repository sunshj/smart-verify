import { useEffect, useMemo, useState } from 'react'

export function useAsyncData<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(null)

  const pending = useMemo(() => !data && !error, [data, error])

  const cleanUp = () => {
    setData(null)
    setError(null)
  }

  const refresh = () => {
    cleanUp()
    fn().then(setData, setError)
  }

  useEffect(() => {
    refresh()

    return cleanUp
  }, [])

  return { pending, data, error, refresh }
}
