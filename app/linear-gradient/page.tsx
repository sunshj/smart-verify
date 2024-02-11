'use client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { compareHashedColor, createLinearGradientImage } from '@/lib/linear-gradient'
import ColorForm, { type ColorFormProps } from '@/components/ColorForm'
import { createConfetti } from '@/lib/confetti'
import useThrottle from '@/lib/use-throttle'

export default function App() {
  const [captchaImage, setCaptchaImage] = useState('')
  const [hashedColor, setHashedColor] = useState('')
  const [resetCount, setResetCount] = useState(0)

  useEffect(() => {
    createLinearGradientImage().then(({ dataURL, hashedColor }) => {
      setCaptchaImage(dataURL)
      setHashedColor(hashedColor)
    })
  }, [resetCount])

  const handleSubmit: ColorFormProps['onSubmit'] = useThrottle(async (values, form) => {
    const success = await compareHashedColor(Object.values(values).join('-'), hashedColor)
    if (!success) {
      toast.error('验证失败，已重置')
      setResetCount(prev => prev + 1)
      form.reset()
      return
    }
    toast.success('验证通过')
    createConfetti()
  }, 1000)

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>线性渐变</CardTitle>
          <CardDescription>请选择正确的起止颜色值和透明度</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div id="captcha" className="w-full h-10 bg-slate-50">
            <img
              className="w-full h-full rounded-sm"
              src={captchaImage}
              alt="linear-gradient-image"
            />
          </div>
          <ColorForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
