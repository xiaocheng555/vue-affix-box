<template>
  <div class="app-layout">
    <layout-header></layout-header>
    <div class="layout-body">
      <layout-sidebar></layout-sidebar>
      <div class="layout-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './layout-header'
import LayoutSidebar from './layout-sidebar'

export default {
  name: 'layout',
  components: {
    LayoutHeader,
    LayoutSidebar
  }
}
</script>

<style lang='less'>
.layout-body {
  padding-top: 60px;
  padding-left: 250px;
}
.layout-main {
  padding: 40px 60px;
}
@media (max-width: 768px) {
  body {
    .layout-header {
      padding: 0 20px;
    }
    .layout-body {
      padding-left: 0;
    }
    .layout-main {
      margin-top: 40px;
      padding: 20px;
    }
    .layout-sidebar {
      position: static;
      overflow: visible;
      width: 100%;
      .sidebar-item-title {
        margin-left: 20px;
      }
      .layout-sidebar-menu {
        border-right: 0;
      }
    }
  }
}
</style>
