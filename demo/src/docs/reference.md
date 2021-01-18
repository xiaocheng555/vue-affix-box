## 相对固定

`reference` 用来设置相对固定的Dom元素。

当affix元素处于固定状态时，滚动使affix元素超出了相对Dom的范围，则affix元素会跟随着相对Dom元素一起运动。

:::demo 
```html
<template>
  <div>
    <div class="reference-box">
      <vue-affix-box 
        reference=".reference-box" 
        :offset-top="200"
        :throttle-limit="0">
        <el-button>affix 元素</el-button>
      </vue-affix-box>
    <div>
  </div>
</template>

<style lang="less">
.reference-box {
  padding: 100px 20px 200px;
  border: 1px solid #409EFF;
}
</style>
```
:::

### 标题相对固定

根据 `reference` 的特性，可以实现下面比较酷的效果。

:::demo 
```html
<template>
  <div>
    <div :class="`section${index}`" v-for="(item, index) in data" :key="index">
      <vue-affix-box 
        :reference="`.section${index}`" 
        :offset-top="70"
        :throttle-limit="0"
        :z-index="5">
        <h4 class="section-title">{{index + 1}}、{{ item }}</h4>
      </vue-affix-box>
      <p v-for="i in 10" :key="i">我是内容</p>
    <div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: ['一帆风顺', '二龙戏珠', '三阳开泰', '四季发财', '五福临门', '六六大顺', '七星揽月', '八面威风', '九五之尊', '十全十美']
    }
  }
}
</script>

<style lang="less">
.section-title {
  margin: 0;
  color: #fff;
  background-color: #333;
}
</style>
```
:::

