'use client'
import { type MouseEventHandler, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  type UserAnswer,
  createTouchCaptchaImage,
  imageSize,
  verifyTouchCaptcha
} from '@/lib/touch-captcha'
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

export default function TouchCaptchaPage() {
  const { data, error, pending, refresh } = useAsyncData(createTouchCaptchaImage)
  const [userAnswer, setUserAnswer] = useState<UserAnswer[]>([])

  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (error) throw error

  const onTouchCaptchaClick: MouseEventHandler<HTMLImageElement> = e => {
    const { offsetX, offsetY, target } = e.nativeEvent
    const { width, height } = target as HTMLImageElement
    if (userAnswer?.length === 3) return
    setUserAnswer(prev => [...prev, { x: offsetX, y: offsetY, w: width, h: height }])
  }

  const reset = () => {
    setUserAnswer([])
    setIsCorrect(false)
    setIsSubmitting(false)
    refresh()
  }

  const submit = useThrottle(async () => {
    if (!data) return
    const { image, answer } = data
    if (userAnswer.length !== 3 || !image?.base64 || answer.length === 0)
      return toast.error('请先完成验证')
    setIsSubmitting(true)
    const result = await verifyTouchCaptcha(userAnswer, { image, answer }).finally(() =>
      setIsSubmitting(false)
    )
    if (!result) {
      toast.error('验证失败，已重置')
      reset()
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
          <CardTitle>文字点选</CardTitle>
          <CardDescription>
            请按顺序点击 <strong>{data?.question?.join('、')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-2">
          {pending && (
            <div
              className="animate-pulse border flex justify-center items-center"
              style={{ width: imageSize, height: imageSize }}
            >
              Loading...
            </div>
          )}
          {!!data?.image && (
            <div className="relative flex justify-center">
              <Image
                draggable={false}
                src={data.image.base64}
                width={data.image.width}
                height={data.image.height}
                onClick={onTouchCaptchaClick}
                alt="touch-captcha"
              />
              {userAnswer?.map((point, index) => (
                <div
                  className="w-5 h-5 bg-red-500 rounded-full absolute text-white flex justify-center items-center"
                  key={index}
                  style={{
                    left: `${point.x - 10}px`,
                    top: `${point.y - 10}px`
                  }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
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
            <Link href="/vernier-caliper" scroll={false}>
              <Button>下一个</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
