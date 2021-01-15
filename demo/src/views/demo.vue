<template>
  <div>
    <h2>$vSize demo</h2>
    <p>#Change the screen size to see the changes</p>

    <div class="box xl-box" v-if="$vSize.isXl">xl visible: {{ $vSize.width }}</div>
    <div class="box lg-box" v-if="$vSize.isLg">lg visible: {{ $vSize.width }}</div>
    <div class="box md-box" v-if="$vSize.isMd">md visible: {{ $vSize.width }}</div>
    <div class="box sm-box" v-if="$vSize.isSm">sm visible: {{ $vSize.width }}</div>
    <div class="box xs-box" v-if="$vSize.isXs">xs visible: {{ $vSize.width }}</div>
  </div>
</template>

<script>
export default {
  name: 'demo',
  data () {
    return {
    }
  },
  watch: {
  },
  created () {}
}
</script>

<style lang='less' scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 500px;
  height: 150px;
  margin: 0 auto;
  margin-top: 40px;
  color: #ffffff;
  font-size: 28px;

}
.xl-box {
  background: #E91E62;
}
.lg-box {
  background: #9C27B0;
}
.md-box {
  background: #2196F3;
}
.sm-box {
  background: #4CAF50;
}
.xs-box {
  background: #795548;
}
</style>
