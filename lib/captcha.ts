'use server'
import bcrypt from 'bcryptjs'
import { createCanvas } from 'canvas'
import { rgbToHex } from './utils'

export async function createCaptchaImage() {
  const width = 400
  const height = 100

  const randomRGBValue = () => Math.floor(Math.random() * 256)
  const startFill = rgbToHex(randomRGBValue(), randomRGBValue(), randomRGBValue())
  const endFill = rgbToHex(randomRGBValue(), randomRGBValue(), randomRGBValue())
  const alpha = Number.parseFloat(Math.random().toFixed(1))

  const hashedColor = await bcrypt.hash(`${startFill}-${endFill}-${alpha}`, 10)

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const linearGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  linearGradient.addColorStop(0, startFill)
  linearGradient.addColorStop(1, endFill)

  ctx.globalAlpha = alpha
  ctx.fillStyle = linearGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const buffer = canvas.toBuffer('image/png')
  return {
    startFill,
    endFill,
    alpha,
    hashedColor,
    dataURL: `data:image/png;base64,${buffer.toString('base64')}`
  }
}

export async function compareHashedColor(input: string, target: string) {
  return await bcrypt.compare(input, target)
}
