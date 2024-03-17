'use server'
import fs from 'node:fs'
import path from 'node:path'
import { createCanvas, loadImage } from 'canvas'
import { delay, randomIn, shuffleArray } from '../utils'
import { chineseChars, fontInfo, fontSize, imageSize, noiseDensity, predefinePosition } from '.'
import type { TouchCaptchaResult, UserAnswer } from './types'

export async function createTouchCaptchaImage(): Promise<TouchCaptchaResult> {
  const canvas = createCanvas(imageSize, imageSize)
  const ctx = canvas.getContext('2d')

  // 绘制背景图
  const backgroundImagePath = await getRandomBackgroundImage()
  const image = await loadImage(backgroundImagePath)
  ctx.drawImage(image, 0, 0, imageSize, imageSize)

  // 总共绘制6个文字，3个正确文字
  // 随机选取6个文字并绘制
  const selectedChineseChars = shuffleArray(chineseChars).slice(0, 6)
  // 随机选取6个位置
  const selectedPositions = shuffleArray(predefinePosition).slice(0, 6)

  const textInfoList = selectedChineseChars.map(text => {
    const position = selectedPositions.shift()!
    const rotate = randomIn(70, -70)
    ctx.save()
    // 移动画布圆心到图片中心点
    ctx.translate(position.x, position.y)
    // 旋转画布
    ctx.rotate((rotate * Math.PI) / 180)

    // 画文字
    ctx.font = fontInfo
    const metrics = ctx.measureText(text)
    const textBgWidth = metrics.width
    const textBgHeight = fontSize
    const textX = -(textBgWidth / 2)
    const textY = -(textBgHeight / 2)
    ctx.fillStyle = '#e0e0e0'
    ctx.textBaseline = 'hanging'
    ctx.fillText(text, textX, textY)
    ctx.strokeStyle = '#666'
    ctx.strokeText(text, textX, textY)

    ctx.restore()

    return {
      // 文字的中心点
      centerPoint: {
        x: position.x,
        y: position.y
      },
      // 文字的最大半径
      radius:
        Math.hypot(fontSize / 2, textBgWidth / 2) + fontSize * 0.74 /* 稍微给大一些检测范围 */,
      text
    }
  })

  // 整体效果
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  // 生成随机噪点像素
  for (let i = 0; i < data.length; i += 4) {
    // 噪点密度控制
    if (Math.random() > noiseDensity) continue
    // 随机灰度噪点
    const grayscale = randomIn(255, 0)

    Array.from({ length: randomIn(20, 2) })
      .fill(0)
      .forEach(() => {
        if (i > data.length) return
        data[i] = grayscale // red
        data[i + 1] = grayscale // green
        data[i + 2] = grayscale // blue
        i += 1
      })
  }
  ctx.putImageData(imageData, 0, 0)

  const answerSet = textInfoList.slice(0, 3)

  return {
    answer: answerSet,
    question: answerSet.map(ans => ans.text),
    image: {
      base64: canvas.toDataURL(),
      width: canvas.width,
      height: canvas.height
    }
  }
}

// 验证点击位置
export async function verifyTouchCaptcha(
  userAnswer: UserAnswer[],
  captchaInfo: Omit<TouchCaptchaResult, 'question'>
) {
  const { width: originWidth, height: originHeight } = captchaInfo.image
  const answerPoints = captchaInfo.answer
  // 转换用户坐标到原始尺寸图像的坐标
  const userPoints = userAnswer.map(point => {
    const { w, h, x, y } = point
    /**
        原始x     原始宽度
        ----  =  --------
        实际x     实际宽度
     */
    if (w !== originWidth) {
      point.x = (originWidth * x) / w
      Reflect.deleteProperty(point, 'w')
    }
    if (h !== originHeight) {
      point.y = (originHeight * y) / h
      Reflect.deleteProperty(point, 'h')
    }

    return point
  })

  await delay(1)
  // 计算用户点击点是否依次点击在了规定范围内

  for (const [i, { centerPoint, radius }] of answerPoints.entries()) {
    const point = userPoints[i]
    if (point === undefined) return false

    const { abs, sqrt } = Math
    const distance = (sqrt(abs(centerPoint.x - point.x)) + sqrt(abs(centerPoint.y - point.y))) ** 2
    if (distance === 0) return false

    if (distance > radius) return false
  }
  return true
}

// 从public/captcha文件夹中随机获取一张图片
async function getRandomBackgroundImage() {
  const captchaImageDir = path.join(process.cwd(), 'public', 'captcha')
  const files = await fs.promises.readdir(captchaImageDir)
  const fileName = files[randomIn(files.length, 0)]
  return `${captchaImageDir}/${fileName}`
}
