// 转为px值
export function toPx (val) {
  return Number.isNaN(+val) ? val : `${val}px`
}

// 获取Dom元素
export function getElement (el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  } else if (typeof el === 'object' && el.nodeType === 1) {
    return el
  } else {
    return null
  }
}

// 获取元素的尺寸大小
export function getElementRect (el) {
  if (el === window) {
    const winHeight = window.innerHeight
    const winWidth = window.innerWidth
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: winHeight,
      right: winWidth,
      height: winHeight,
      width: winWidth
    }
  } else {
    return el.getBoundingClientRect()
  }
}
