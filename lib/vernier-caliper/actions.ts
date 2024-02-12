'use server'
import { createCanvas, registerFont } from 'canvas'
import { delay } from '../utils'
import { getQuestion } from '.'

registerFont('./fonts/OpenSans.ttf', { family: 'OpenSans' })

// 主尺图片高宽
const imgHeight = 40
const imgWidth = 300
const fontSize = 10 // 文字大小
const backgroundColor = '#ddd' // 背景颜色
const fontColor = '#000' // 字体颜色、刻度颜色
const fontInfo = `${fontSize}px OpenSans`
const paddingLeft = 5 // 主尺刻度距离左边的距离
const unit = 'mm'

export async function createVernierCaliperImage() {
  // 主尺刻度范围 最小值在0到50，最大值在最小值的基础上增加30到35
  const minNum = Math.round(Math.random() * 50)
  const maxNum = minNum + Math.round(Math.random() * 5 + 30)

  // 副尺刻度范围 最小值在-9到0，最大值在10到18
  const viceMinNum = -1 * Math.round(Math.random() * 9)
  const viceMaxNum = Math.round(Math.random() * 8 + 10)

  // 主尺刻度数量
  const numCount = maxNum - minNum
  // 主尺刻度范围高宽
  const height = imgHeight
  const width = imgWidth - 10
  // 主尺单位像素宽度
  const unitWidth = width / (numCount + 3)

  // 副尺刻度宽度
  const viceWidth = unitWidth * 9 + 20
  // 副尺单位 像素宽度
  const viceUnitWidth = (unitWidth * 9) / 10
  // 副尺刻度距离左边的距离
  const vicePaddingLeft = Math.round(Math.random() * (imgWidth - viceWidth))

  // 主尺、副尺画布
  const canvas = createCanvas(imgWidth, imgHeight)
  const viceCanvas = createCanvas(imgWidth, imgHeight)

  const ctx = canvas.getContext('2d')
  const viceCtx = viceCanvas.getContext('2d')

  ctx.fillStyle = backgroundColor
  viceCtx.fillStyle = backgroundColor

  // 渲染背景
  ctx.fillRect(0, 0, imgWidth, imgHeight)
  // 向右移动一点点画布，避免第一个刻度与图片左边框重合导致看不清刻度的问题
  ctx.translate(paddingLeft, 0)

  // 画主尺 ---------------------------

  let showUnit = false // 是否已显示过刻度单位

  for (let i = 0; i <= numCount; i++) {
    const x = i * unitWidth
    let lineHeight = 8 // 默认刻度高度
    const num = i + minNum // 实际刻度值需要当前值加上最小刻度值

    // 显示的刻度信息
    let numberStr = ''
    if (num % 5 === 0) {
      lineHeight = 11
      if (num % 10 === 0) {
        lineHeight = 14
        numberStr = num.toString()
        if (!showUnit) {
          // 第一个刻度数字显示单位
          showUnit = true
          numberStr += unit
        }
      }
    }
    ctx.fillStyle = fontColor
    ctx.beginPath()
    ctx.moveTo(x, height)
    ctx.lineTo(x, height - lineHeight) // 画刻度
    if (numberStr) {
      ctx.font = fontInfo
      ctx.fillText(numberStr, x, fontSize + 10)
    }
    ctx.stroke()
  }

  // 画副尺 同上-----------------------------------
  viceCtx.fillRect(0, 0, imgWidth, imgHeight)

  viceCtx.translate(vicePaddingLeft + paddingLeft, 0)
  for (let i = viceMinNum; i <= viceMaxNum; i++) {
    const x = i * viceUnitWidth
    let lineHeight = 8
    let showNumber = false
    if (i % 5 === 0) {
      lineHeight = 11
      if (i % 10 === 0) {
        lineHeight = 14
        showNumber = true
      }
    }
    viceCtx.beginPath()
    viceCtx.fillStyle = fontColor
    viceCtx.moveTo(x, 0)
    viceCtx.lineTo(x, lineHeight)
    if (showNumber) {
      viceCtx.font = fontInfo
      viceCtx.fillText(i.toString(), x, fontSize + lineHeight)
    }
    viceCtx.stroke()
  }

  const { question, answer } = getQuestion({
    minNum,
    maxNum,
    unitWidth,
    vicePaddingLeft,
    unit
  })

  await delay(1)
  return {
    question,
    answer,
    mainImageBase64: canvas.toDataURL(),
    viceImageBase64: viceCanvas.toDataURL()
  }
}
