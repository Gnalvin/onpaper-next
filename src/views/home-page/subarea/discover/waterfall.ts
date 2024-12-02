type option = {
  itemWidth: number
  headGap: number
  leftGap: number
  itemClassName: string
  containerClassName: string
}

export default class Waterfall {
  $el: HTMLElement | null
  items: NodeListOf<Element> | [] // 需要排序的元素
  itemClassName: string
  containerClassName: string
  itemWidth: number // 单个item的宽度 不含空隙
  leftGap: number // 左右空隙
  headGap: number // 上下空隙
  loaded: number //当新的数据添加时 之前排序过的不需要排序,loaded 用于记录排序到第几个
  cols: number // 列数
  heights: number[] // 存储每列的高度方便计算
  translateMap: Map<number, { offsetY: number; offsetX: number }>
  startIndex: number
  endIndex: number

  constructor(option: option) {
    this.itemWidth = option.itemWidth
    this.headGap = option.headGap
    this.leftGap = option.leftGap
    this.itemClassName = option.itemClassName
    this.containerClassName = option.containerClassName
    this.$el = null
    this.items = []
    this.loaded = 0
    this.cols = 0
    this.startIndex = 0
    this.endIndex = 0
    this.heights = []
    this.translateMap = new Map<number, { offsetY: number; offsetX: number }>()
  }
  //当元素挂载完成后 调用
  init() {
    this.$el = document.querySelector(this.containerClassName)
    this.items = this.getItems()
    this.loaded = 0
    this.cols = this.getCols()
    this.heights = []
  }
  // 计算容器可容纳列数
  getCols() {
    return ~~(this.$el!.offsetWidth / (this.itemWidth + this.leftGap))
  }
  // 获取需要排序的元素
  getItems() {
    return this.$el!.querySelectorAll(this.itemClassName)
  }
  // 获取当前最小的高度在哪一列
  getMinIndex() {
    const min = Math.min.apply(null, this.heights)
    return this.heights.indexOf(min)
  }
  //获取当前最高高度
  getMaxHeight() {
    return Math.max.apply(null, this.heights)
  }
  //重设容器高度
  setWaterFallRect() {
    const max = this.getMaxHeight()
    this.$el!.style.height = max + 'px'
  }
  setTranslateMap(height: number) {
    let offsetX: number
    let offsetY: number
    if (this.loaded < this.cols) {
      offsetY = 0
      offsetX = this.loaded * (this.itemWidth + this.leftGap)
      this.heights.push(height)
    } else {
      const minIndex = this.getMinIndex()
      offsetY = this.heights[minIndex] + this.headGap
      offsetX = minIndex * (this.itemWidth + this.leftGap)
      this.heights[minIndex] = offsetY + height
    }

    this.translateMap.set(this.loaded, { offsetY, offsetX })
    this.loaded++
    this.setWaterFallRect()
  }
  render() {
    this.$el = document.querySelector(this.containerClassName)
    this.items = this.getItems()
    for (let i = 0; i < this.items.length; i++) {
      const { offsetX, offsetY } = this.translateMap.get(i + this.startIndex)!
      const item = this.items[i] as HTMLElement
      item.style.transform = `translate(${offsetX}px,${offsetY}px)`
    }
  }
  reSetData() {
    this.$el = null
    this.items = []
    this.loaded = 0
    this.cols = 0
    this.startIndex = 0
    this.endIndex = 0
    this.heights = []
  }
}
