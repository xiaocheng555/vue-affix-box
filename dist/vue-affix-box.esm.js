import { throttle } from 'throttle-debounce';
import ResizeObserver from 'resize-observer-polyfill';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// 转为px值
function toPx(val) {
  return Number.isNaN(+val) ? val : "".concat(val, "px");
} // 获取Dom元素

function getElement(el) {
  if (typeof el === 'string') {
    return document.querySelector(el);
  } else if (_typeof(el) === 'object' && el.nodeType === 1) {
    return el;
  } else {
    return null;
  }
} // 获取元素的尺寸大小

function getElementRect(el) {
  if (el === window) {
    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: winHeight,
      right: winWidth,
      height: winHeight,
      width: winWidth
    };
  } else {
    return el.getBoundingClientRect();
  }
}

//
var script = {
  name: 'c-affix',
  props: {
    target: {
      type: String | Object
    },
    reference: {
      type: String | Object
    },
    offsetTop: {
      type: Number,
      "default": 0
    },
    offsetBottom: {
      type: Number
    },
    zIndex: {
      type: Number
    },
    throttleLimit: {
      type: Number,
      "default": 0
    }
  },
  data: function data() {
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
    };
  },
  computed: {
    // 是固定在顶部
    isFixedTop: function isFixedTop() {
      return typeof this.offsetBottom !== 'number';
    },
    // 占位层样式
    placeholderStyle: function placeholderStyle() {
      if (this.isFixed) {
        return {
          height: this.placeholderHeight + 'px'
        };
      }
    },
    // 固定层的样式
    affixStyle: function affixStyle() {
      if (this.isFixed) {
        var _this$affixPos = this.affixPos,
            top = _this$affixPos.top,
            bottom = _this$affixPos.bottom,
            left = _this$affixPos.left,
            width = _this$affixPos.width;
        return {
          zIndex: this.zIndex,
          width: toPx(width),
          top: toPx(top),
          left: toPx(left),
          bottom: toPx(bottom)
        };
      }
    }
  },
  methods: {
    // 初始化
    init: function init() {
      this.scroller = getElement(this.target) || window;
      this.referenceEl = getElement(this.reference);
      if (!this.scroller) return;
      this.bindEvent();
      this.updatePosition();
    },
    // 绑定事件
    bindEvent: function bindEvent() {
      this.handleUpdatePosition = throttle(this.throttleLimit, this.updatePosition);
      this.scroller.addEventListener('scroll', this.handleUpdatePosition, {
        passive: true
      });
      window.addEventListener('resize', this.handleUpdatePosition);
      this.bindObserver();
    },
    // 绑定元素尺寸监听事件
    bindObserver: function bindObserver() {
      var _this = this;

      // 监听固定层尺寸，使占位层高度与固定层高度保持一致
      this.observer = new ResizeObserver(function (entries) {
        if (!_this.isFixed) return;

        _this.handleUpdatePosition();
      });
      this.observer.observe(this.$refs.affix);
      this.observer.observe(this.$refs.placeholder);
    },
    // 取消绑定事件
    unbindEvent: function unbindEvent() {
      this.scroller && this.scroller.removeEventListener('scroll', this.handleUpdatePosition);
      this.observer && this.observer.disconnect();
    },
    // 更新位置
    updatePosition: function updatePosition() {
      var placeholderEl = this.$refs.placeholder;
      var affixEl = this.$refs.affix;
      if (!placeholderEl || !affixEl) return; // 获取元素Rect

      var placeholderRect = placeholderEl.getBoundingClientRect();
      var affixRect = affixEl.getBoundingClientRect();
      var scrollRect = getElementRect(this.scroller); // 检测元素是否固定

      this.isFixed = this.checkFixed(this.isFixedTop, placeholderRect, scrollRect);
      if (!this.isFixed) return;
      this.affixPos.left = placeholderRect.left; // 保持固定层宽度与占位层宽度一致（特别是占位层宽度自适应）

      this.affixPos.width = placeholderRect.width; // 保持占位层高度与固定层高度一致（特别是固定层高度变化时）

      this.placeholderHeight = affixRect.height;

      if (this.isFixedTop) {
        // 固定顶部时，计算top值
        this.affixPos.bottom = undefined;
        this.affixPos.top = scrollRect.top + this.offsetTop;
      } else {
        // 固定底部时，计算bottom值
        this.affixPos.top = undefined;
        this.affixPos.bottom = scrollRect.height - scrollRect.bottom + this.offsetBottom;
      }

      this.handleReferenceEffect(affixRect);
    },
    // 处理参考元素对固定层的影响
    handleReferenceEffect: function handleReferenceEffect(affixRect) {
      if (!this.referenceEl) return;
      var referenceRect = this.referenceEl.getBoundingClientRect();
      var fixedRect = this.getFixedRect(affixRect); // 固定层是否超出参考元素底部

      if (referenceRect.bottom - fixedRect.bottom <= 0) {
        this.affixPos.bottom = 'auto';
        this.affixPos.top = referenceRect.bottom - fixedRect.height;
      } else if (referenceRect.top - fixedRect.top >= 0) {
        // 固定层是否超出参考元素顶部
        this.affixPos.bottom = 'auto';
        this.affixPos.top = referenceRect.top;
      }
    },
    // 获取固定层保持固定时的尺寸大小，非真实dom的尺寸，区别是真实dom偶尔会跟随参考元素运动，不是一直固定
    getFixedRect: function getFixedRect(affixRect) {
      var top;
      var bottom;
      var affixWidth = affixRect.width;
      var affixHeight = affixRect.height;

      if (this.isFixedTop) {
        top = this.offsetTop;
        bottom = this.offsetTop + affixHeight;
      } else {
        var winHeight = window.innerHeight;
        top = winHeight - this.offsetBottom - affixHeight;
        bottom = winHeight - this.offsetBottom;
      }

      return {
        top: top,
        bottom: bottom,
        height: affixHeight,
        width: affixWidth
      };
    },
    // 计算是否固定
    checkFixed: function checkFixed(isFixedTop, placeholderRect, scrollRect) {
      if (isFixedTop) {
        return placeholderRect.top - scrollRect.top < this.offsetTop;
      } else {
        return scrollRect.bottom - placeholderRect.bottom < this.offsetBottom;
      }
    }
  },
  created: function created() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.init();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.unbindEvent();
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { ref: "placeholder", style: _vm.placeholderStyle }, [
    _c(
      "div",
      {
        ref: "affix",
        staticClass: "c-affix",
        class: _vm.isFixed ? "is-fixed" : "",
        style: _vm.affixStyle
      },
      [_vm._t("default")],
      2
    )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-503e7a8c_0", { source: ".c-affix.is-fixed {\n  position: fixed;\n  z-index: 10;\n}\n", map: {"version":3,"sources":["vue-affix-box.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,WAAW;AACb","file":"vue-affix-box.vue","sourcesContent":[".c-affix.is-fixed {\n  position: fixed;\n  z-index: 10;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

Object.defineProperty(__vue_component__, 'install', {
  configurable: false,
  enumerable: false,
  value: function value(Vue, options) {
    // Set default prop values for VueAffixBox
    for (var key in options) {
      if (key in __vue_component__.props) {
        __vue_component__.props[key]["default"] = options[key];
      }
    }

    Vue.component('vue-affix-box', __vue_component__);
  }
});

export default __vue_component__;
