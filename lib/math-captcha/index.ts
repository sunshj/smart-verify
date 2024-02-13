export * from './actions'

export const codeWidth = 300
export const codeHeight = 40
export const codeRange = 10
export const codeOperate = ['+', '-']

export interface MathCaptchaResult {
  answer: string
  image: {
    base64: string
    width: number
    height: number
  }
}
