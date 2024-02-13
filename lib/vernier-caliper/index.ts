export * from './actions'

export function getQuestion(options: {
  maxNum: number
  minNum: number
  unitWidth: number
  vicePaddingLeft: number
  unit: string
}) {
  const { maxNum, minNum, unitWidth, vicePaddingLeft, unit } = options

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
