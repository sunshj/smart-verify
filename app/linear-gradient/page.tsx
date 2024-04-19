'use client'
import { toast } from 'sonner'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { compareHashedColor, createLinearGradientImage } from '@/lib/linear-gradient/actions'
import ColorForm, { type ColorFormProps } from '@/components/ColorForm'
import { createConfetti } from '@/lib/confetti'
import useThrottle from '@/lib/throttle'
import { useAsyncData } from '@/lib/async-data'

export default function LinearGradientPage() {
  const { data, error, pending, refresh } = useAsyncData(createLinearGradientImage)

  if (error) throw error

  const handleSubmit: ColorFormProps['onSubmit'] = useThrottle(async values => {
    if (!data) return false
    const success = await compareHashedColor(Object.values(values).join('-'), data?.hashedColor)
    if (!success) {
      toast.error('验证失败，已重置')
      refresh()
    } else {
      toast.success('验证通过')
      createConfetti()
    }
    return success
  }, 1000)

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>线性渐变</CardTitle>
          <CardDescription>请选择正确的起止颜色值和透明度</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="w-full h-10">
            {pending && (
              <div className="animate-pulse flex justify-center items-center h-full border rounded-sm">
                加载中...
              </div>
            )}
            {!!data?.image && (
              <Image
                draggable={false}
                className="w-full h-full rounded-sm"
                src={data.image?.base64}
                width={data.image?.width}
                height={data.image?.height}
                alt="linear-gradient-image"
              />
            )}
          </div>
          <ColorForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
