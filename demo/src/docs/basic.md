## 基础用法

设置 `offset-top` 固定顶部， 设置 `offset-bottom` 固定底部。

:::tip
组件默认支持宽度自适应，请缩放屏幕查看demo。
:::

:::demo 
```html
<template>
  <div class="box">
    <vue-affix-box :offset-top="100">
      <el-button>固定顶部</el-button>
    </vue-affix-box>
    <vue-affix-box :offset-bottom="100" style="margin-left: 300px;">
      <el-button>固定底部</el-button>
    </vue-affix-box>
  <div>
</template>

<style lang="less">
.box {
  margin-top: 500px;
  margin-bottom: 600px;
}
</style>
```
:::

