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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
} // 事件处理工具，解决dom重复绑定多个相同事件的问题

var EventUtil = /*#__PURE__*/function () {
  function EventUtil() {
    _classCallCheck(this, EventUtil);

    // 事件合集
    this.events = []; // 调试用
    // window._events = this.events = []
  } // 绑定事件


  _createClass(EventUtil, [{
    key: "on",
    value: function on(listener, event, handler) {
      var _this$findEventEntry = this.findEventEntry(listener, event),
          _this$findEventEntry2 = _slicedToArray(_this$findEventEntry, 1),
          eventEntry = _this$findEventEntry2[0];

      if (!eventEntry) {
        // 创建事件实体
        eventEntry = {
          listener: listener,
          event: event,
          handlers: [handler],
          callback: function callback() {
            var _this = this;

            eventEntry.handlers.forEach(function (hd) {
              return hd.call(_this);
            });
          }
        };
        this.events.push(eventEntry); // 绑定事件，相同的listener和event只绑定一次

        listener.addEventListener(event, eventEntry.callback, {
          passive: true
        });
      } else {
        eventEntry.handlers.push(handler);
      }
    } // 移除事件

  }, {
    key: "off",
    value: function off(listener, event, handler) {
      var _this$findEventEntry3 = this.findEventEntry(listener, event),
          _this$findEventEntry4 = _slicedToArray(_this$findEventEntry3, 2),
          eventEntry = _this$findEventEntry4[0],
          eventIndex = _this$findEventEntry4[1];

      if (eventEntry) {
        var delIndex = eventEntry.handlers.indexOf(handler);
        delIndex > -1 && eventEntry.handlers.splice(delIndex, 1);

        if (eventEntry.handlers.length === 0) {
          // 解绑事件
          listener.removeEventListener(event, eventEntry.callback); // 清除数据存储

          this.events.splice(eventIndex, 1);
          eventEntry = {};
        }
      }
    } // 查找事件实体

  }, {
    key: "findEventEntry",
    value: function findEventEntry(listener, event) {
      var result = [null, -1];
      this.events.some(function (item, index) {
        if (item.listener === listener && item.event === event) {
          result[0] = item;
          result[1] = index;
          return true;
        }
      });
      return result;
    } // 清空事件合集

  }, {
    key: "clear",
    value: function clear() {
      this.eventMap = {};
    }
  }]);

  return EventUtil;
}();

var eventUtil = new EventUtil();

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
      "default": 50
    },
    disabled: {
      type: Boolean,
      "default": false
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
          height: toPx(this.placeholderHeight)
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
      eventUtil.on(this.scroller, 'scroll', this.handleUpdatePosition, {
        passive: true
      });
      eventUtil.on(window, 'resize', this.handleUpdatePosition);
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
      eventUtil.off(this.scroller, 'scroll', this.handleUpdatePosition);
      eventUtil.off(window, 'resize', this.handleUpdatePosition);
      this.observer && this.observer.disconnect();
    },
    // 更新位置
    updatePosition: function updatePosition() {
      var placeholderEl = this.$refs.placeholder;
      var affixEl = this.$refs.affix;
      var _oldIsFixed = this.isFixed;
      if (!placeholderEl || !affixEl) return;

      if (this.disabled) {
        this.isFixed = false;
        return;
      } // 获取元素Rect


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

      this.handleReferenceEffect(affixRect); // 触发事件

      if (this.isFixed !== _oldIsFixed) {
        this.$emit('change', this.isFixed);
      }
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
  watch: {
    disabled: function disabled(val) {
      if (!val) {
        this.updatePosition();
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
    inject("data-v-49898be0_0", { source: ".c-affix.is-fixed {\n  position: fixed;\n  z-index: 10;\n}\n", map: {"version":3,"sources":["vue-affix-box.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,WAAW;AACb","file":"vue-affix-box.vue","sourcesContent":[".c-affix.is-fixed {\n  position: fixed;\n  z-index: 10;\n}\n"]}, media: undefined });

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
