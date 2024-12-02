type option = {
  columns: number
  headGap: number
  leftGap: number
  minWidth: number
  defaultHight: number
  itemClassName: string
  containerClassName: string
}

export default class Waterfall {
  $el: HTMLElement | null
  items: NodeListOf<Element> | [] // 需要排序的元素
  itemClassName: string
  containerClassName: string
  itemWidth: number // 单个item的宽度 不含空隙
  maxWidth: number // 单个item 最大宽度
  leftGap: number // 左右空隙
  headGap: number // 上下空隙
  cols: number // 列数
  defaultHight: number //默认高度
  loader: number // 已经初始化第几个
  heights: { [key: number]: number } = {} // 存储每列的高度方便计算
  translateMap: Map<
    number,
    { offsetY: number; offsetX: number; height: number }
  >

  constructor(option: option) {
    this.cols = option.columns
    this.headGap = option.headGap
    this.leftGap = option.leftGap
    this.itemClassName = option.itemClassName
    this.containerClassName = option.containerClassName
    this.$el = null
    this.items = []
    this.itemWidth = 0
    this.loader = 0
    this.maxWidth = option.minWidth
    this.cols = option.columns
    this.defaultHight = option.defaultHight
    this.heights = {}
    this.translateMap = new Map<
      number,
      { offsetY: number; offsetX: number; height: number }
    >()
  }
  //当元素挂载完成后 调用
  init() {
    this.$el = document.querySelector(this.containerClassName)
    this.items = this.getItems()
    this.itemWidth = this.getItemWith()

    this.initHeight()
  }
  // 获取需要排序的元素
  getItems() {
    return this.$el!.querySelectorAll(this.itemClassName)
  }
  // 计算元素宽度
  getItemWith() {
    if (this.maxWidth && this.cols == 1)
      this.cols = ~~(this.$el!.offsetWidth / (this.maxWidth + this.leftGap))
    return ~~((this.$el!.offsetWidth - this.cols * this.leftGap) / this.cols)
  }
  // 初始化高度
  initHeight() {
    for (let index = this.loader; index < this.items.length; index++) {
      let offsetX = 0
      let offsetY = 0
      const item = this.items[index] as HTMLElement
      if (index < this.cols) {
        offsetY = 0
        offsetX = index * (this.itemWidth + this.leftGap)
        this.heights[index] = this.defaultHight
      } else {
        const minIndex = this.getMinIndex()
        offsetY = this.heights[minIndex] + this.headGap
        offsetX = minIndex * (this.itemWidth + this.leftGap)
        this.heights[minIndex] = offsetY + this.defaultHight
      }

      this.translateMap.set(index, {
        offsetY,
        offsetX,
        height: this.defaultHight
      })
      item.style.transform = `translate(${offsetX}px,${offsetY}px)`
      item.style.width = `${this.itemWidth}px`
      this.loader++
    }
    this.setWaterFallRect()
  }

  // 获取当前最小的高度在哪一列
  getMinIndex() {
    let minIndex = 0
    let minHeight = Infinity
    for (const [index, height] of Object.entries(this.heights)) {
      if (height < minHeight) {
        minIndex = Number(index)
        minHeight = height
      }
    }
    return minIndex
  }

  //获取当前最高高度
  getMaxHeight() {
    return Math.max(...Object.values(this.heights))
  }

  //重设容器高度
  setWaterFallRect() {
    const max = this.getMaxHeight()
    this.$el!.style.height = max + 'px'
  }
  // 重置尺寸
  reSize(nowHeight: number, index: number) {
    this.init()
    // 获取元素当前的 translate 值
    const translate = this.translateMap.get(index)!
    // 计算元素所在的列
    const column = translate.offsetX / (this.itemWidth + this.leftGap)
    // 计算高度差
    const heightDiff = nowHeight - translate.height
    // 如果高度变化了 则重新渲染
    if (heightDiff === 0) return
    this.reRender(index, column, heightDiff)
    translate.height = nowHeight
    this.translateMap.set(index, translate)
  }

  // 渲染函数
  reRender(index: number, column: number, heightDiff: number) {
    // 遍历 translateMap 中 index 之后的元素
    for (let i = index + 1; i < this.translateMap.size; i++) {
      // 获取元素当前的 offsetX 值
      const translate = this.translateMap.get(i)!
      // 计算元素所在的列
      const currentColumn = translate.offsetX / (this.itemWidth + this.leftGap)
      if (column == currentColumn) {
        translate.offsetY = translate.offsetY + heightDiff
        // 更新元素在 translateMap 中的 offsetY 值
        this.translateMap.set(i, translate)
        const item = this.items[i] as HTMLElement
        item.style.transform = `translate(${translate.offsetX}px,${translate.offsetY}px)`
      }
    }
    // 更新 heights 对象中对应列的高度
    this.heights[column] += heightDiff
  }

  reSort() {
    this.heights = {}
    this.itemWidth = this.getItemWith()
    for (let index = 0; index < this.items.length; index++) {
      const translate = this.translateMap.get(index)!
      const item = this.items[index] as HTMLElement
      if (index < this.cols) {
        translate.offsetY = 0
        translate.offsetX = index * (this.itemWidth + this.leftGap)
        this.heights[index] = translate.height
      } else {
        const minIndex = this.getMinIndex()
        translate.offsetY = this.heights[minIndex] + this.headGap
        translate.offsetX = minIndex * (this.itemWidth + this.leftGap)
        this.heights[minIndex] = translate.offsetY + translate.height
      }

      this.translateMap.set(index, translate)
      item.style.transform = `translate(${translate.offsetX}px,${translate.offsetY}px)`
      item.style.width = `${this.itemWidth}px`
    }
    this.setWaterFallRect()
  }
  reSetData() {
    this.$el = null
    this.items = []
    this.cols = 0
    this.heights = []
  }
}
