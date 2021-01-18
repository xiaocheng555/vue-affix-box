<template>
  <div class="layout-sidebar">
    <el-menu
      class="layout-sidebar-menu"
      :default-active="activePath"
      router>
      <template v-for="(menu, index) in menuList">
        <sidebar-item :menu="menu" :key="index"></sidebar-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { menus } from '../config'
import SidebarItem from './sidebar-item'

export default {
  name: 'layout-sidebar',
  components: {
    SidebarItem
  },
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    activePath () {
      return this.$route.path
    }
  },
  methods: {
    // 生成菜单列表
    genMenuList () {
      function getAuthMenu (menus) {
        const menuList = []
        menus.forEach(menu => {
          if (Array.isArray(menu.children)) {
            menu.children = getAuthMenu(menu.children)
          }
          menuList.push(menu)
        })
        return menuList
      }
      this.menuList = getAuthMenu(menus)
    }
  },
  created () {
    this.genMenuList()
  }
}
</script>

<style lang='less'>
.layout-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 250px;
  z-index: 5;
  overflow: auto;
  &:hover {
    &::-webkit-scrollbar {
      display: block;
    }
  }
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    display: none;
  }

  /* 外层轨道 */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);

    &:window-inactive {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
.layout-sidebar-menu {
  padding-top: 20px;
  height: 100%;
  box-sizing: border-box;
}
</style>
