import { type ComponentProps, type SyntheticEvent, useCallback, useEffect, useRef } from 'react'

interface Props extends ComponentProps<'div'> {
  interval?: number
  onPress?: (e: SyntheticEvent) => void
  onPressEnd?: (e: SyntheticEvent) => void
}

export default function PressedBox({ interval, onPress, onPressEnd, ...props }: Props) {
  const intervalId = useRef<NodeJS.Timeout | null>(null)
  const pressInterval = useRef<number>(interval ?? 200)

  const handleHoldDown = useCallback(
    (e: SyntheticEvent) => {
      intervalId.current = setInterval(() => {
        onPress?.(e)
      }, pressInterval.current)
    },
    [onPress]
  )

  const handleHoldUp = useCallback(
    (e: SyntheticEvent) => {
      if (intervalId) clearInterval(intervalId.current!)
      onPressEnd?.(e)
    },
    [onPressEnd]
  )

  useEffect(() => {
    return () => {
      clearInterval(intervalId.current!)
      intervalId.current = null
    }
  }, [])

  return (
    <div
      onMouseDown={handleHoldDown}
      onMouseUp={handleHoldUp}
      onMouseLeave={handleHoldUp}
      onTouchStart={handleHoldDown}
      onTouchEnd={handleHoldUp}
      {...props}
    >
      {props.children}
    </div>
  )
}
