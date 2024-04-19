'use client'
import React, { useState } from 'react'
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
import { Button } from '@/components/ui/button'

export default function SlideCaptchaPage() {
  const [isCorrect, setIsCorrect] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      setIsCorrect(true)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>滑块验证</CardTitle>
          <CardDescription>拖动下方滑块完成拼图</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-2"></CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="secondary">重置</Button>
          {!isCorrect && (
            <Button onClick={submit}>
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
