'use client'
import NextProgressbar from 'next13-progressbar'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NextProgressbar showOnShallow />
    </>
  )
}
