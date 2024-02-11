import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StartHome() {
  return (
    <div className="h-full flex justify-center items-center">
      <Link href="/vernier-caliper" scroll={false}>
        <Button>Start verification</Button>
      </Link>
    </div>
  )
}
