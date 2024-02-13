export * from './actions'

export const imageWidth = 400
export const imageHeight = 100

export interface LinearGradientCaptchaResult {
  image: {
    base64: string
    width: number
    height: number
  }
  hashedColor: string
}
