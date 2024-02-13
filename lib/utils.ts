import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomIn(max: number, min: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

export const randomHexColor = () => `#${Math.random().toString(16).slice(2, 8).padStart(6, '0')}`

export function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

export const randomColor = (min: number, max: number) => {
  const r = randomIn(min, max)
  const g = randomIn(min, max)
  const b = randomIn(min, max)
  return { r, g, b, rgbColor: `rgb(${r},${g},${b})`, hexColor: rgbToHex(r, g, b) }
}

export function shuffleArray<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
