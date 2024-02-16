import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'

export interface ColorFormProps {
  onSubmit: (values: z.infer<typeof FormSchema>) => Promise<boolean>
}

const FormSchema = z.object({
  startFill: z.string(),
  endFill: z.string(),
  alpha: z.coerce.number().step(0.1).min(0.1).max(1)
})

export default function ColorForm(props: ColorFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startFill: '#ff0000',
      endFill: '#000000',
      alpha: 0.1
    }
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const result = await props.onSubmit(values)
    if (!result) {
      form.reset()
    }
    return result
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex justify-around gap-2">
          <FormField
            control={form.control}
            name="startFill"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>起始颜色</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endFill"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>终止颜色</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alpha"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>透明度</FormLabel>
                <FormControl>
                  <Input type="number" step={0.1} min={0.1} max={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交
          </Button>
        </div>
      </form>
    </Form>
  )
}
