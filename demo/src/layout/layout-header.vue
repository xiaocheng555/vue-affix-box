<template>
  <div class="layout-header">
    <a href="/" class="layout-header-logo">
      {{ logo }}
    </a>
    <div class="layout-header-right">
      <a class="github-icon" :href="githubUrl" target="_blank"></a>
    </div>
  </div>
</template>

<script>
import { logo, githubUrl } from '../config'

export default {
  name: 'layout-header',
  data () {
    return {
      logo,
      githubUrl
    }
  }
}
</script>

<style lang="less">
.layout-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
  padding: 0 50px;
  box-shadow: 0 2px 8px #f0f1f2;
  background: #ffffff;
}
.layout-header-logo {
  font-size: 22px;
  font-weight: 600;
  font-family: Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  color: rgba(0,0,0,.85);
}
.layout-header-right {
  flex: 1;
  text-align: right;
}
.github-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  background: url('~@/assets/icons/github.svg') no-repeat center center;
  background-size: cover;
}
</style>
