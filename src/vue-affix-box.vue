<template>
  <div ref="placeholder" :style="placeholderStyle">
    <div
      ref="affix"
      class="c-affix"
      :class="isFixed ? 'is-fixed' : ''"
      :style="affixStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import throttle from 'throttle-debounce/throttle'
import ResizeObserver from 'resize-observer-polyfill'
import { toPx, getElement, getElementRect, eventUtil } from './utils'

export default {
  name: 'c-affix',
  props: {
    // 目标滚动元素
    target: {
      type: String | Object
    },
    // 参考元素
    reference: {
      type: String | Object
    },
    // 超过视图距离时，参考元素定位不变（优化，元素超出视图一定范围内，位置不变，能减少不必要渲染）
    overView: {
      type: Number,
      default: 400
    },
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: {
      type: Number
    },
    zIndex: {
      type: Number
    },
    throttleLimit: {
      type: Number,
      default: 50
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 固定层宽度是否紧凑，true则使用max-width，false则使用width；解决固定层宽度超出子元素宽度，会遮挡住其他dom元素
    compact: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否固定
      isFixed: false,
      // 滚动dom元素
      scroller: null,
      // 占位层高度
      placeholderHeight: undefined,
      // 固定层位置
      affixPos: {
        top: undefined,
        bottom: undefined,
        left: undefined,
        width: undefined
      },
      // 尺寸监听对象
      observer: null
    }
  },
  computed: {
    // 是固定在顶部
    isFixedTop () {
      return typeof this.offsetBottom !== 'number'
    },
    // 占位层样式
    placeholderStyle () {
      if (this.isFixed) {
        return {
          height: toPx(this.placeholderHeight)
        }
      }
    },
    // 固定层的样式
    affixStyle () {
      if (this.isFixed) {
        const { top, bottom, left, width } = this.affixPos
        return {
          zIndex: this.zIndex,
          [this.compact ? 'max-width' : 'width']: toPx(width),
          top: toPx(top),
          left: toPx(left),
          bottom: toPx(bottom)
        }
      }
    }
  },
  methods: {
    // 初始化
    init () {
      this.scroller = getElement(this.target) || window
      this.referenceEl = getElement(this.reference)
      if (!this.scroller) return
      this.bindEvent()
      this.updatePosition()
    },
    // 绑定事件
    bindEvent () {
      this.handleUpdatePosition = throttle(this.throttleLimit, this.updatePosition)
      eventUtil.on(this.scroller, 'scroll', this.handleUpdatePosition)
      eventUtil.on(window, 'resize', this.handleUpdatePosition)
      this.bindObserver()
    },
    // 绑定元素尺寸监听事件
    bindObserver () {
      // 监听固定层尺寸，使占位层高度与固定层高度保持一致
      this.observer = new ResizeObserver((entries) => {
        if (!this.isFixed) return
        this.handleUpdatePosition()
      })
      this.observer.observe(this.$refs.affix)
      this.observer.observe(this.$refs.placeholder)
    },
    // 取消绑定事件
    unbindEvent () {
      eventUtil.off(this.scroller, 'scroll', this.handleUpdatePosition)
      eventUtil.off(window, 'resize', this.handleUpdatePosition)
      this.observer && this.observer.disconnect()
    },
    // 更新位置
    updatePosition () {
      const placeholderEl = this.$refs.placeholder
      const affixEl = this.$refs.affix
      const _oldIsFixed = this.isFixed
      if (!placeholderEl || !affixEl) return
      if (this.disabled) {
        this.isFixed = false
        return
      }

      // 获取元素Rect
      const placeholderRect = placeholderEl.getBoundingClientRect()
      const affixRect = affixEl.getBoundingClientRect()
      const scrollRect = getElementRect(this.scroller)

      // 检测元素是否固定
      this.isFixed = this.checkFixed(this.isFixedTop, placeholderRect, scrollRect)
      if (!this.isFixed) return

      this.affixPos.left = placeholderRect.left
      // 保持固定层宽度与占位层宽度一致（特别是占位层宽度自适应）
      this.affixPos.width = placeholderRect.width
      // 保持占位层高度与固定层高度一致（特别是固定层高度变化时）
      this.placeholderHeight = affixRect.height

      if (this.isFixedTop) {
        // 固定顶部时，计算top值
        this.affixPos.bottom = undefined
        this.affixPos.top = scrollRect.top + this.offsetTop
      } else {
        // 固定底部时，计算bottom值
        this.affixPos.top = undefined
        this.affixPos.bottom = scrollRect.height - scrollRect.bottom + this.offsetBottom
      }

      this.handleReferenceEffect(affixRect)
      // 触发事件
      if (this.isFixed !== _oldIsFixed) {
        this.$emit('change', this.isFixed)
      }
    },
    // 处理参考元素对固定层的影响
    handleReferenceEffect (affixRect) {
      if (!this.referenceEl) return

      const referenceRect = this.referenceEl.getBoundingClientRect()
      const fixedRect = this.getFixedRect(affixRect)

      // 固定层是否超出参考元素底部
      if (referenceRect.bottom - fixedRect.bottom <= 0) {
        this.affixPos.bottom = 'auto'
        this.affixPos.top = referenceRect.bottom - fixedRect.height
      } else if (referenceRect.top - fixedRect.top >= 0) {
        // 固定层是否超出参考元素顶部
        this.affixPos.bottom = 'auto'
        this.affixPos.top = referenceRect.top
      }
      // 优化：固定层位置不能超过可视范围的设置距离（overView）,减少不必要渲染
      const allowRange = {
        min: -this.overView,
        max: this.overView + window.innerHeight
      }
      if (this.affixPos.top < allowRange.min) {
        this.affixPos.top = allowRange.min
      } else if (this.affixPos.top > allowRange.max) {
        this.affixPos.top = allowRange.max
      }
    },
    // 获取固定层保持固定时的尺寸大小，非真实dom的尺寸，区别是真实dom偶尔会跟随参考元素运动，不是一直固定
    getFixedRect (affixRect) {
      let top
      let bottom
      const affixWidth = affixRect.width
      const affixHeight = affixRect.height
      if (this.isFixedTop) {
        top = this.offsetTop
        bottom = this.offsetTop + affixHeight
      } else {
        const winHeight = window.innerHeight
        top = winHeight - this.offsetBottom - affixHeight
        bottom = winHeight - this.offsetBottom
      }
      return {
        top: top,
        bottom: bottom,
        height: affixHeight,
        width: affixWidth
      }
    },
    // 计算是否固定
    checkFixed (isFixedTop, placeholderRect, scrollRect) {
      if (isFixedTop) {
        return placeholderRect.top - scrollRect.top < this.offsetTop
      } else {
        return scrollRect.bottom - placeholderRect.bottom < this.offsetBottom
      }
    }
  },
  watch: {
    disabled (val) {
      if (!val) {
        this.updatePosition()
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy () {
    this.unbindEvent()
  }
}
</script>

<style lang='less'>
.c-affix {
  &.is-fixed {
    position: fixed;
    z-index: 10;
  }
}
</style>
