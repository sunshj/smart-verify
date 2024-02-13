'use client'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex justify-center items-center flex-col gap-3 h-full pb-20">
      <h2 className="text-3xl">Something went wrong!</h2>
      <div className="text-red-600 text-base">{error.message}</div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
