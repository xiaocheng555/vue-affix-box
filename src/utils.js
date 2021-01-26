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

/*
 * addEventListener是否支持passive属性
 */
function testSupportsPassive () {
  let support = false
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        support = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) { }
  return support
}
export const supportsPassive = testSupportsPassive()

/*
 * 事件处理工具，解决dom重复绑定多个相同事件的问题
 */
export class EventUtil {
  constructor () {
    // 事件合集
    this.events = []
    // 调试用
    // window._events = this.events = []
  }

  // 绑定事件
  on (listener, event, handler, capture = false) {
    let [eventEntry] = this.findEventEntry(listener, event)
    if (!eventEntry) {
      // 创建事件实体
      eventEntry = {
        listener: listener,
        event: event,
        handlers: [handler],
        callback () {
          eventEntry.handlers.forEach(hd => hd.call(this))
        }
      }
      this.events.push(eventEntry)
      const options = supportsPassive ? {
        capture: capture,
        passive: true
      } : capture
      // 绑定事件，相同的listener和event只绑定一次
      listener.addEventListener(event, eventEntry.callback, options)
    } else {
      eventEntry.handlers.push(handler)
    }
  }

  // 移除事件
  off (listener, event, handler, capture = false) {
    let [eventEntry, eventIndex] = this.findEventEntry(listener, event)
    if (eventEntry) {
      const delIndex = eventEntry.handlers.indexOf(handler)
      delIndex > -1 && eventEntry.handlers.splice(delIndex, 1)

      if (eventEntry.handlers.length === 0) {
        // 解绑事件
        listener.removeEventListener(event, eventEntry.callback, capture)
        // 清除数据存储
        this.events.splice(eventIndex, 1)
        eventEntry = {}
      }
    }
  }

  // 查找事件实体
  findEventEntry (listener, event) {
    const result = [null, -1]
    this.events.some((item, index) => {
      if (item.listener === listener && item.event === event) {
        result[0] = item
        result[1] = index
        return true
      }
    })
    return result
  }

  // 清空事件合集
  clear () {
    this.events = []
  }
}

export const eventUtil = new EventUtil()
