import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed w-full h-screen z-[999] flex justify-center items-center bg-slate-900 bg-opacity-30">
      <Loader className="animate-spin text-white text-4xl" />
    </div>
  )
}
