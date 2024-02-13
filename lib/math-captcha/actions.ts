'use server'
import { createCanvas } from 'canvas'
import bcrypt from 'bcryptjs'
import { randomColor, randomIn } from '../utils'
import { type MathCaptchaResult, codeHeight, codeOperate, codeRange, codeWidth } from '.'

export async function createMathCaptchaImage(): Promise<MathCaptchaResult> {
  const canvas = createCanvas(codeWidth, codeHeight)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = randomColor(180, 240).rgbColor
  ctx.fillRect(0, 0, codeWidth, codeHeight)
  // 绘制干扰线
  for (let j = 0; j < 3; j++) {
    ctx.strokeStyle = randomColor(40, 180).rgbColor
    ctx.beginPath()
    ctx.moveTo(randomIn(0, codeWidth), randomIn(0, codeHeight))
    ctx.lineTo(randomIn(0, codeWidth), randomIn(0, codeHeight))
    ctx.stroke()
  }
  // 绘制干扰点
  for (let k = 0; k < 30; k++) {
    ctx.fillStyle = randomColor(0, 255).rgbColor
    ctx.beginPath()
    ctx.arc(randomIn(0, codeWidth), randomIn(0, codeHeight), 1, 0, 2 * Math.PI)
    ctx.fill()
  }
  const { formula, answer } = generateFormula()

  for (let i = 0; i < formula.length; i++) {
    // 随机生成字体颜色
    ctx.fillStyle = randomColor(50, 160).rgbColor
    // 随机生成字体大小(0.5 - 0.75)高的范围
    ctx.font = `${randomIn((codeHeight * 2) / 4, (codeHeight * 3) / 4)}px SimHei`
    // 字体对齐位置
    ctx.textBaseline = 'top'

    const x = 20 + i * (codeWidth / formula.length)
    const y = randomIn(5, codeHeight / 4)
    ctx.fillText(formula[i], x, y)
  }

  const hashedAnswer = await bcrypt.hash(answer.toString(), 10)

  return {
    answer: hashedAnswer,
    image: {
      base64: canvas.toDataURL(),
      width: codeWidth,
      height: codeHeight
    }
  }
}

function generateFormula() {
  let formula = '' // 公式字符串
  let answer = 0 // 计算结果

  const num1 = Math.floor(Math.random() * codeRange)
  const num2 = Math.floor(Math.random() * codeRange)
  const symbol = codeOperate[Math.floor(Math.random() * 2)] ?? '+'
  if (symbol === '+') {
    formula = `${num1}+${num2}=?`
    answer = num1 + num2
  } else {
    if (num1 >= num2) {
      formula = `${num1}-${num2}=?`
    } else {
      formula = `${num2}-${num1}=?`
    }
    answer = Math.abs(num1 - num2)
  }
  return { formula, answer }
}

export async function verifyMathCaptcha(input: number, answer: string) {
  return await bcrypt.compare(input.toString(), answer)
}
