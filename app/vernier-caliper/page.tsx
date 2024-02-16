'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { createVernierCaliperImage, verifyAnswer } from '@/lib/vernier-caliper'
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
import useThrottle from '@/lib/use-throttle'
import PressedBox from '@/components/PressedBox'

export default function VernierCaliperPage() {
  const [mainImage, setMainImage] = useState('')
  const [viceImage, setViceImage] = useState('')
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState<string[]>([])

  const [userAnswer, setUserAnswer] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [resetCount, setResetCount] = useState(0)
  const [isSelected, setIsSelected] = useState(false)
  const [mouseTempLeftMove, setMouseTempLeftMove] = useState(0)
  const [mouseLeftMove, setMouseLeftMove] = useState(0)

  const viceCaliperRef = useRef<HTMLDivElement | null>(null)

  const pending = useMemo(() => !mainImage || !viceImage, [mainImage, viceImage])

  const getX = (e: MouseEvent | TouchEvent) => {
    if (e && 'touches' in e) {
      return e.touches[0].screenX
    }
    if (e && 'screenX' in e) {
      return e.screenX
    }
    return 0
  }

  const onMouseUp = useCallback(() => {
    setMouseTempLeftMove(userAnswer)
    setIsSelected(false)
  }, [userAnswer])

  const onMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    setMouseLeftMove(getX(e))
    setIsSelected(true)
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isSelected) return
      setUserAnswer(mouseTempLeftMove + getX(e) - mouseLeftMove)
    },
    [isSelected, mouseLeftMove, mouseTempLeftMove]
  )

  useEffect(() => {
    createVernierCaliperImage()
      .then(({ mainImageBase64, viceImageBase64, question, answers }) => {
        setMainImage(mainImageBase64)
        setViceImage(viceImageBase64)
        setQuestion(question)
        setAnswers(answers)
      })
      .catch(error => setError(error))
  }, [resetCount])

  if (error) throw error

  useEffect(() => {
    const viceCaliper = viceCaliperRef.current
    if (!viceCaliper) return

    viceCaliper.addEventListener('mouseup', onMouseUp)
    viceCaliper.addEventListener('touchend', onMouseUp, { passive: false })

    viceCaliper.addEventListener('mouseleave', onMouseUp)

    viceCaliper.addEventListener('mousedown', onMouseDown)
    viceCaliper.addEventListener('touchstart', onMouseDown, { passive: false })

    viceCaliper.addEventListener('mousemove', onMouseMove)
    viceCaliper.addEventListener('touchmove', onMouseMove, { passive: false })

    return () => {
      viceCaliper.removeEventListener('mouseup', onMouseUp)
      viceCaliper.removeEventListener('touchend', onMouseUp)
      viceCaliper.removeEventListener('mouseleave', onMouseUp)

      viceCaliper.removeEventListener('mousedown', onMouseDown)
      viceCaliper.removeEventListener('touchstart', onMouseDown)

      viceCaliper.removeEventListener('mousemove', onMouseMove)
      viceCaliper.removeEventListener('touchmove', onMouseMove)
    }
  }, [onMouseDown, onMouseMove, onMouseUp])

  const reset = () => {
    setMainImage('')
    setViceImage('')
    setUserAnswer(0)
    setMouseLeftMove(0)
    setMouseTempLeftMove(0)
    setIsCorrect(false)
    setIsSubmitting(false)
    setError(null)
    setResetCount(prev => prev + 1)
  }

  const submit = useThrottle(async () => {
    setIsSubmitting(true)
    const result = await verifyAnswer(userAnswer, answers).finally(() => setIsSubmitting(false))
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
          <CardDescription>拖动副尺使游标卡尺的读数为 {question}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="w-full overflow-hidden relative">
            <div className="relative h-10">
              {pending && (
                <div className="animate-pulse flex justify-center items-center h-full">
                  加载主尺中...
                </div>
              )}
              {!pending && (
                <img
                  draggable={false}
                  loading="lazy"
                  src={mainImage}
                  alt="main-caliper-image"
                  className="absolute top-0 left-0 h-full w-full"
                />
              )}
            </div>
            <div className="relative h-10" ref={viceCaliperRef}>
              {pending && (
                <div className="animate-pulse flex justify-center items-center h-full">
                  加载副尺中...
                </div>
              )}
              {!pending && (
                <img
                  className="absolute top-0 left-0 h-full w-full"
                  src={viceImage}
                  alt="vice-caliper-image"
                  style={{ left: `${userAnswer}px` }}
                />
              )}
            </div>
            <PressedBox interval={100} onPress={() => setUserAnswer(prev => prev - 1)}>
              <button
                className="absolute left-1 bottom-1 p-1 rounded-md hover:bg-indigo-300 hover:bg-opacity-60 animate-in animate-out delay-150 select-none"
                onClick={() => setUserAnswer(prev => prev - 1)}
              >
                ⬅
              </button>
            </PressedBox>
            <PressedBox interval={100} onPress={() => setUserAnswer(prev => prev + 1)}>
              <button
                className="absolute right-1 bottom-1 p-1 rounded-md hover:bg-indigo-300 hover:bg-opacity-60 animate-in animate-out delay-150 select-none"
                onClick={() => setUserAnswer(prev => prev + 1)}
              >
                ➡
              </button>
            </PressedBox>
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
            <Link href="/linear-gradient" scroll={false}>
              <Button>下一个</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
