'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { codeHeight, createMathCaptchaImage, verifyMathCaptcha } from '@/lib/math-captcha'
import useThrottle from '@/lib/throttle'
import { createConfetti } from '@/lib/confetti'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAsyncData } from '@/lib/async-data'

export default function NumberPlusPage() {
  const { data, error, pending, refresh } = useAsyncData(createMathCaptchaImage)

  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (error) throw error

  const reset = () => {
    setUserAnswer('')
    setIsCorrect(false)
    setIsSubmitting(false)
    refresh()
  }

  const submit = useThrottle(async () => {
    if (!data) return
    if (!userAnswer) return toast.error('请输入答案')
    setIsSubmitting(true)
    const result = await verifyMathCaptcha(Number(userAnswer), data.answer).finally(() =>
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
          <CardTitle>数学运算</CardTitle>
          <CardDescription>在下方输入框内填写计算结果</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-2">
          {pending && (
            <div
              className="animate-pulse border flex justify-center items-center"
              style={{ height: codeHeight }}
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
                alt="math-captcha"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              id="math-result"
              className="flex-2"
              placeholder="计算结果"
              value={userAnswer}
              type="number"
              onChange={e => setUserAnswer(e.target.value)}
            ></Input>
          </div>
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
            <Link href="/touch-captcha" scroll={false}>
              <Button>下一个</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
