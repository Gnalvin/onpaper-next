export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomColor() {
  return (
    'rgba(' +
    getRandomInt(100, 200) +
    ', ' +
    getRandomInt(40, 60) +
    ', ' +
    getRandomInt(100, 200) +
    ',' +
    getRandomInt(7, 9) / 10 +
    ')'
  )
}
