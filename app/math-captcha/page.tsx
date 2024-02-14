'use client'
import { useEffect, useMemo, useState } from 'react'
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
import {
  type MathCaptchaResult,
  codeHeight,
  createMathCaptchaImage,
  verifyMathCaptcha
} from '@/lib/math-captcha'
import useThrottle from '@/lib/use-throttle'
import { createConfetti } from '@/lib/confetti'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NumberPlusPage() {
  const [image, setImage] = useState<MathCaptchaResult['image']>()
  const [answer, setAnswer] = useState<string>('')
  const [userAnswer, setUserAnswer] = useState<string>('')

  const [resetCount, setResetCount] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pending = useMemo(() => !image, [image])
  const [error, setError] = useState(null)

  useEffect(() => {
    createMathCaptchaImage()
      .then(({ image, answer }) => {
        setImage(image)
        setAnswer(answer)
      })
      .catch(error => {
        setError(error)
      })
  }, [resetCount])

  if (error) throw error

  const reset = () => {
    setImage(undefined)
    setUserAnswer('')
    setIsCorrect(false)
    setIsSubmitting(false)
    setError(null)
    setResetCount(prev => prev + 1)
  }

  const submit = useThrottle(async () => {
    if (!userAnswer) return toast.error('请输入答案')
    setIsSubmitting(true)
    const result = await verifyMathCaptcha(Number(userAnswer), answer).finally(() =>
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
          {image && (
            <div className="relative flex justify-center">
              <Image
                draggable={false}
                src={image.base64}
                width={image.width}
                height={image.height}
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
