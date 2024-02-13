export * from './actions'
export * from './types'

// 验证图图片大小(正方形图片)
export const imageSize = 300
export const bgImagePath = '/touch-captcha-bg.jpg'
// 绘制文字大小
export const fontSize = 40
export const fontInfo = `bold ${fontSize}px Sans`
// 噪点密度
export const noiseDensity = 0.03
// 文字库
export const chineseChars =
  `天地玄黄宇宙洪荒日月辰宿列张来往秋收冬闰余成岁吕调阳云致雨结为金生丽水玉出昆冈剑号巨珠称夜光果珍菜芥海咸河淡羽翔龙师火帝鸟官人始制文字乃服衣推位让国有陶唐吊民伐罪周发汤坐朝问道拱平章臣伏戎一体率宾归王鸣凤在竹白驹食场化被草木及万方此身发四大五常恭惟养岂敢伤女贞洁男效才良知过必改得能莫忘谈彼短恃己长信使可器欲难悲丝染诗羔羊行贤克念作圣名立形表正`.split(
    ''
  )

// 预选位置
export const predefinePosition = [
  { x: 60, y: 60 },
  { x: 150, y: 80 },
  { x: 240, y: 60 },

  { x: 70, y: 160 },
  { x: 140, y: 160 },
  { x: 210, y: 134 },

  { x: 60, y: 240 },
  { x: 160, y: 230 },
  { x: 240, y: 240 }
]
