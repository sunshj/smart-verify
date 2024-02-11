'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Footer() {
  const router = useRouter()
  return (
    <>
      <div
        className="fixed left-1 bottom-1 p-2 cursor-pointer"
        onClick={() => {
          router.back()
        }}
      >
        Previous
      </div>
      <div
        className="fixed right-1 bottom-1 p-2 cursor-pointer"
        onClick={() => {
          router.forward()
        }}
      >
        Next
      </div>
    </>
  )
}
