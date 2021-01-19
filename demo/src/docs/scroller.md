## 滚动容器

用 `target` 设置 `Vue-affix-box` 组件需要监听其滚动事件的元素，默认为 window。

:::tip
如果使用了target绑定滚动容器，滚动容器外层还能滚动的话，affix固定的元素会跑到外层；因此需要手动监听外层的滚动元素，然后手动调用 `updatePosition` 方法更新affix元素的位置。（如下例子）
:::

:::demo 
```html
<template>
  <div class="container">
    <vue-affix-box ref="affix" target=".container" :offset-top="0">
      <el-button>固定顶部</el-button>
    </vue-affix-box>
    
    <p v-for="i in 50" :key="i">{{ i }}</p><!-- 用来撑起高度，方便查看demo查看 -->
  <div>
</template>

<script>
export default {
  mounted () {
    this.updateAffix = () => {
      this.$refs.affix && this.$refs.affix.updatePosition()
    }
    window.addEventListener('scroll', this.updateAffix)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.updateAffix)
  }
}
</script>

<style lang="less">
.container {
  box-sizing: border-box;
  height: 300px;
  margin-bottom: 100px;
  padding: 100px 20px 0;
  border: 1px solid #409EFF;
  overflow: auto;
}
</style>
```
:::
