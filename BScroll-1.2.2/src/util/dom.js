// 缓存
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

// 解决各个浏览器版本问题
function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

/**
 * addEventListener passive 参数详情
 * 参考网站：http://www.cnblogs.com/ziyunfei/p/5545439.html
 */
export function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, {passive: false, capture: !!capture})
}

export function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, {passive: false, capture: !!capture})
}
// 元素一层一层累加定位父级距离之和
export function offset(el) {
  let left = 0
  let top = 0

  while (el) {
    left -= el.offsetLeft
    top -= el.offsetTop
    el = el.offsetParent
  }

  return {
    left,
    top
  }
}

let transform = prefixStyle('transform')

export const hasPerspective = prefixStyle('perspective') in elementStyle
export const hasTouch = 'ontouchstart' in window
export const hasTransform = transform !== false
export const hasTransition = prefixStyle('transition') in elementStyle

export const style = {
  transform,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
}

export const TOUCH_EVENT = 1
export const MOUSE_EVENT = 2

export const eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
}

export function getRect(el) {
  if (el instanceof window.SVGElement) {
    var rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

export function preventDefaultException(el, exceptions) {
  for (let i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true
    }
  }
  return false
}

export function tap(e, eventName) {
  let ev = document.createEvent('Event')
  ev.initEvent(eventName, true, true)
  ev.pageX = e.pageX
  ev.pageY = e.pageY
  e.target.dispatchEvent(ev)
}

/**
 *  initEvent
 *  eventType:  字符串值。事件的类型。
 *  canBubble:  事件是否起泡。
 *  cancelable: 是否可以用 preventDefault() 方法取消事件。
 */
export function click(e) {
  var target = e.target

  if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
    let ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event')
    // cancelable 设置为 false 是为了解决和 fastclick 冲突问题
    ev.initEvent('click', true, false)
    ev._constructed = true
    target.dispatchEvent(ev)
  }
}

export function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

export function before(el, target) {
  target.parentNode.insertBefore(el, target)
}
