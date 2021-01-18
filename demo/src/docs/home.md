## 快速使用

### 安装

```bash
$ npm i vue-affix-box -S
```

or

```bash
$ yarn add vue-affix-box
```

### 引入
 
全局引入:

``` javascript
import Vue from 'vue'
import VueAffixBox from 'vue-affix-box'

Vue.component('vue-affix-box', VueAffixBox)
```

局部引入:

``` javascript
import VueAffixBox from 'vue-affix-box'

export default {
  components: {
    VueAffixBox
  },
  ...
}
```

### 使用

``` html
<vue-affix-box :offset-top="100">
  <div>固定顶部</div>
</vue-affix-box>

<vue-affix-box :offset-bottom="100">
  <div>固定底部</div>
</vue-affix-box>
```

## API

### Props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| offsetTop    | 距离窗口顶部达到指定偏移量后触发 | number | — | 0 |
| offsetBottom | 距离窗口底部达到指定偏移量后触发 | number | — | — |
| target | 设置 Affix 需要监听其滚动事件的元素 | string/object | — | window |
| reference | 设置 Affix 相对固定的元素 | string/object | — | — |
| zIndex | z-index 堆叠顺序 | number | — | 10 |
| throttleLimit | 滚动事件的节流时间 | number | — | 50 |
| disabled | 是否禁用 | boolean | — | false |

### Methods
| 方法名 | 说明 | 参数 |
|---------- |-------- |---------- |
| updatePosition | 更新 Affix 位置 | — |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 固定状态改变时触发的事件 | 当前固定状态 |