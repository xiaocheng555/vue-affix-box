<template>
  <el-submenu v-if="menu.type === 'submenu'" :index="uid">
    <template slot="title">
      <span class="sidebar-item-title">{{ menu.title }}</span>
    </template>
    <template v-if="Array.isArray(menu.children)">
      <menu-child
        v-for="(childMenu, cIndex) in menu.children"
        :menu="childMenu"
        :key="cIndex">
      </menu-child>
    </template>
  </el-submenu>
  <el-menu-item-group
    v-else-if="menu.type === 'group'"
    v-show="Array.isArray(menu.children) && menu.children.length > 0"
    :title="menu.title">
    <template v-if="Array.isArray(menu.children)">
      <menu-child
        v-for="(childMenu, cIndex) in menu.children"
        :menu="childMenu"
        :key="cIndex">
      </menu-child>
    </template>
  </el-menu-item-group>
  <el-menu-item v-else :index="menu.path">
    <span class="sidebar-item-title" slot="title">{{ menu.title }}</span>
  </el-menu-item>
</template>

<script>
// 生成guid
function guid () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

export default {
  name: 'sidebar-item',
  components: {},
  props: {
    menu: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      uid: guid()
    }
  },
  beforeCreate () {
    this.$options.components.MenuChild = require('./sidebar-item').default
  },
  created () {}
}
</script>

<style lang='less'>
.sidebar-item-title {
  margin-left: 35px;
}
</style>
