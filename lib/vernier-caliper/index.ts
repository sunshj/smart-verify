export * from './actions'

// 主尺图片高宽
export const imgHeight = 40
export const imgWidth = 300
export const fontSize = 10 // 文字大小
export const backgroundColor = '#ddd' // 背景颜色
export const fontColor = '#000' // 字体颜色、刻度颜色
export const fontInfo = `${fontSize}px sans,sans-serif`
export const paddingLeft = 5 // 主尺刻度距离左边的距离
export const unit = 'mm'

export function getQuestion(options: {
  maxNum: number
  minNum: number
  unitWidth: number
  vicePaddingLeft: number
}) {
  const { maxNum, minNum, unitWidth, vicePaddingLeft } = options

  const question = Math.random() * (maxNum - 15 - minNum - 4) + minNum + 4
  const answer = Number(((question - minNum) * unitWidth - vicePaddingLeft).toFixed(1))

  if (answer >= -3 && answer <= 3) {
    return getQuestion(options)
  } else {
    return {
      question: question.toFixed(1) + unit,
      answer
    }
  }
}
