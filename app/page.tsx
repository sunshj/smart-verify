import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StartHome() {
  return (
    <div className="h-full flex justify-center items-center">
      <Link href="/math-captcha" scroll={false}>
        <Button>Start verification</Button>
      </Link>
    </div>
  )
}
