import { useEffect, useMemo, useState } from 'react'

export function useAsyncData<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState(null)
  const [refreshCount, setRefreshCount] = useState(0)

  const pending = useMemo(() => !data && !error, [data, error])
  const refresh = () => setRefreshCount(p => p + 1)

  useEffect(() => {
    fn().then(setData).catch(setError)

    return () => {
      setData(undefined)
      setError(null)
    }
  }, [refreshCount])

  return { pending, data, error, refresh }
}
