export const moneyScope = [
  { value: '50 ~ 200', label: '50 ~ 200 元' },
  { value: '200 ~ 500 ', label: '200 ~ 500 元' },
  { value: '500 ~ 1000', label: '500 ~ 1000 元' },
  { value: '1000 ~ 3000', label: '1000 ~ 3000 元' },
  { value: '3000 ~ 5000', label: '3000 ~ 5000 元' },
  { value: '5000 ~ 10000', label: '5000 ~ 10000 元' },
  { value: '10000+', label: '1万元以上' }
]

export const fileType = ['JPG', 'PNG', 'PSD', 'AI', 'SVG', 'GIF', 'TIF']

export const payment = [
  { value: '2', label: '简要验收' },
  { value: '3', label: '常规验收' },
  { value: '4', label: '精细验收' },
  { value: '5', label: '严格验收' },
  { value: '1', label: '不分步 (不推荐)' }
]

export const contactType = [
  { value: 'QQ', label: 'QQ' },
  { value: 'Phone', label: '手机' },
  { value: 'WeChat', label: '微信' }
]

export function createStep(payment: string) {
  switch (payment) {
    case '1':
      return [{ step: '终稿', percent: 100 }]
    case '2':
      return [
        { step: '线稿', percent: 40 },
        { step: '终稿', percent: 100 }
      ]
    case '3':
      return [
        { step: '草稿', percent: 20 },
        { step: '线稿', percent: 50 },
        { step: '终稿', percent: 100 }
      ]
    case '4':
      return [
        { step: '草稿', percent: 20 },
        { step: '线稿', percent: 35 },
        { step: '上色', percent: 70 },
        { step: '终稿', percent: 100 }
      ]
    default:
      return [
        { step: '草稿', percent: 20 },
        { step: '线稿', percent: 40 },
        { step: '上色', percent: 60 },
        { step: '精修', percent: 80 },
        { step: '终稿', percent: 100 }
      ]
  }
}

export const introTemp = `不要直接使用！请根据实际情况更改！！
-------------------------------
hi~大家好，我现在开始接稿了。

我擅长画各种风格的插画，从可爱到写实，从简约到复杂。
要是有关XX或OO的约稿，会让我更有创作动力。

如果你能给我一些具体的要求，比如角色的姿势、表情、服装，或者故事的背景、氛围等，我会更快地完成你的插画。

不能画大叔或者硬汉的类型，御姐和萝莉可以画。不接受砍价。
请不要太含糊或模糊地描述你的需求，这会让我很困惑和难以入手。

希望大家可以像平时点图那样，放轻松些大胆约!`

export const requestTemp = `不要直接使用！请根据实际情况更改！！
-------------------------------
太太，您好：

我关注您很久啦，非常喜欢您的画风和创意。

我想请您为我画一幅_______（主题）的插画，我想象中的画面大概是_____（希望看到的内容）这样的。
我的预算是_______（金额），希望能在_______（日期）之前收到您的作品。

作品需要保留原设定的某些特征；您可以在约定的时间后公开发布完成的作品；作品将用于印刷需要注意上色格式等。

非常感谢您的时间和考虑。期待您的回复。`

export const useOption = [
  {
    value: '个人用途',
    label: '个人用途',
    children: [
      { value: '个人收藏', label: '个人收藏' },
      { value: '社交展示', label: '社交展示' },
      { value: '壁纸头像', label: '壁纸头像' },
      { value: '其他', label: '其他' }
    ]
  },
  {
    value: '商业用途',
    label: '商业用途',
    children: [
      { value: '游戏用途', label: '游戏用途' },
      { value: '商业宣传', label: '商业宣传' },
      { value: '虚拟主播', label: '虚拟主播' },
      { value: '书刊绘本', label: '书刊绘本' },
      { value: '周边贩售', label: '周边贩售' },
      { value: '其他', label: '其他' }
    ]
  }
]

export const openOption = [
  { value: 'open', label: '可以自由发布' },
  { value: 'appoint', label: '需要约定公开发布' },
  { value: 'privacy', label: '不可公开发布' }
]

export const category = [
  '自设/OC',
  '插图',
  '头像',
  'Live2D',
  '立绘',
  'Q版',
  '封面',
  '壁纸',
  '场景',
  '其他'
]

export const fileSize = [
  { value: 'game', label: '3600*4800 px', tip: '游戏卡牌图' },
  { value: 'pc', label: '1920*1080 px', tip: '高清电脑屏幕' },
  { value: 'square', label: '500*500 px', tip: '正方形图片' },
  { value: 'weibo', label: '宽度 500px , 高度不限', tip: '微博微信长图' },
  { value: 'a4', label: '216*291 mm 含出血/300 dpi', tip: 'A4印刷品' },
  { value: 'diy', label: '需与画师商议稿件尺寸' }
]

export const feedBack = [
  { value: 0, label: '不需要定期反馈' },
  { value: 3, label: '每 3 天至少进行一次反馈' },
  { value: 5, label: '每 5 天至少进行一次反馈' },
  { value: 7, label: '每 7 天至少进行一次反馈' },
  { value: 15, label: '每 15 天至少进行一次反馈' }
]

export const config = {
  moneyScope,
  fileType,
  payment,
  contactType,
  introTemp,
  requestTemp,
  useOption,
  openOption,
  category,
  fileSize,
  feedBack
}

export const choseNavList = [
  { value: 0, label: '待接受' },
  { value: 1, label: '沟通中' },
  { value: 2, label: '创作中' },
  { value: 3, label: '完成' },
  { value: -1, label: '关闭' }
]
