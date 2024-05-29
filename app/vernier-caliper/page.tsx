'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import VernierCaliper from 'vernier-caliper'
import { createVernierCaliper, verifyAnswer } from 'vernier-caliper/actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createConfetti } from '@/lib/confetti'
import useThrottle from '@/lib/throttle'
import { useAsyncData } from '@/lib/async-data'

export default function VernierCaliperPage() {
  const { data, error, pending, refresh } = useAsyncData(createVernierCaliper)

  const [userAnswer, setUserAnswer] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (error) throw error

  const reset = () => {
    setUserAnswer(0)
    setIsCorrect(false)
    setIsSubmitting(false)
    refresh()
  }

  const submit = useThrottle(async () => {
    if (!data) return
    setIsSubmitting(true)
    const result = await verifyAnswer(userAnswer, data.answers).finally(() =>
      setIsSubmitting(false)
    )
    if (!result) {
      setIsCorrect(false)
      reset()
      toast.error('验证失败，已重置')
      return
    }
    toast.success('验证成功')
    setIsCorrect(true)
    createConfetti()
  }, 1000)

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>游标卡尺</CardTitle>
          <CardDescription>拖动副尺使游标卡尺的读数为 {data?.question}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <VernierCaliper
            loading={pending}
            mainCaliperImage={data?.mainCaliperImage}
            viceCaliperImage={data?.viceCaliperImage}
            onChange={setUserAnswer}
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button disabled={pending} variant="secondary" onClick={reset}>
            重置
          </Button>
          {!isCorrect && (
            <Button disabled={pending} onClick={submit}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              提交
            </Button>
          )}
          {isCorrect && (
            <Link href="/linear-gradient" scroll={false}>
              <Button>下一个</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
