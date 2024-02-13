import type { CanvasRenderingContext2D } from 'canvas'

export interface CaptchaAnswer {
  centerPoint: {
    x: number
    y: number
  }
  radius: number
  text: string
}

export interface TouchCaptchaResult {
  answer: CaptchaAnswer[]
  question: string[]
  image: {
    base64: string
    width: number
    height: number
  }
}

export interface DrawTextOptions {
  ctx: CanvasRenderingContext2D
  textCenterX?: number
  textCenterY?: number
  rotate?: number
  text?: string
}

export interface UserAnswer {
  x: number
  y: number
  w: number
  h: number
}
