'use server'
import bcrypt from 'bcryptjs'
import { createCanvas } from 'canvas'
import { randomHexColor } from '../utils'
import { type LinearGradientCaptchaResult, imageHeight, imageWidth } from '.'

export async function createLinearGradientImage(): Promise<LinearGradientCaptchaResult> {
  const startFill = randomHexColor()
  const endFill = randomHexColor()
  const alpha = Number.parseFloat(Math.random().toFixed(1)) || 0.1

  const hashedColor = await bcrypt.hash(`${startFill}-${endFill}-${alpha}`, 10)

  const canvas = createCanvas(imageWidth, imageHeight)
  const ctx = canvas.getContext('2d')

  const linearGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  linearGradient.addColorStop(0, startFill)
  linearGradient.addColorStop(1, endFill)

  ctx.globalAlpha = alpha
  ctx.fillStyle = linearGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return {
    hashedColor,
    image: {
      base64: canvas.toDataURL(),
      width: imageWidth,
      height: imageHeight
    }
  }
}

export async function compareHashedColor(input: string, target: string) {
  return await bcrypt.compare(input, target)
}
