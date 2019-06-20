function generateOrderArr(n, m) {
  if (n > m) return []
  const arr = []
  for (let i = n; i <= m; i++) {
    arr.push(i)
  }
  return arr
}

function subArray(arr, length) {
  let index = 0
  const array = []
  while (index < arr.length) {
    array.push(arr.slice(index, index += length))
  }
  return array
}

function fullZero(num) { // 不足10的日期或时间数值前面补上0
  return num < 10 ? '0' + num : num
}

export { generateOrderArr, subArray, fullZero }
