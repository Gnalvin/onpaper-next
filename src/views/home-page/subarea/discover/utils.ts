import type Waterfall from './waterfall'

// 二分查找
function binarySearch(
  low: number,
  high: number,
  offset: number,
  waterfall: Waterfall
) {
  let middle = 0
  let currentOffset = 0
  while (low <= high) {
    middle = low + Math.floor((high - low) / 2)
    currentOffset = waterfall.translateMap.get(middle)!.offsetY

    if (currentOffset == offset) {
      return middle
    } else if (currentOffset < offset) {
      low = middle + 1
    } else if (currentOffset > offset) {
      high = middle - 1
    }
  }
  if (low > 0) {
    return low - 1
  }
  return 0
}
// 指数查找
export function exponentialSearch(
  index: number,
  offset: number,
  waterfall: Waterfall
) {
  let interval = 1
  while (
    index < waterfall.loaded &&
    waterfall.translateMap.get(index)!.offsetY < offset
  ) {
    index += interval
    interval *= 2
  }
  const low = Math.floor(index / 2)
  const height = Math.min(index, waterfall.loaded - 1)
  return binarySearch(low, height, offset, waterfall)
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomColor() {
  return (
    'rgba(' +
    getRandomInt(80, 150) +
    ', ' +
    getRandomInt(30, 80) +
    ', ' +
    getRandomInt(30, 130) +
    ', ' +
    getRandomInt(1, 9) / 10 +
    ')'
  )
}
