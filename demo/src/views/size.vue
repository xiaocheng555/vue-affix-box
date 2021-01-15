<template>
  <div>
    <h2>change size</h2>
    <div class="content">
      Click the button and the size will become as below：
      <button @click="changeSize">change size</button>
      <span class="changed-text" v-if="isChange">changed!</span>
      <br>
      <table border="1" cellspacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Changed Size</th>
            <th>Default Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>xl</td>
            <td>>=1904</td>
            <td><span class="td-del">>=1920</span></td>
          </tr>
          <tr>
            <td>isLg</td>
            <td>>=1264</td>
            <td><span class="td-del">>=1200</span></td>
          </tr>
          <tr>
            <td>isMd</td>
            <td>>=960</td>
            <td><span class="td-del">>=992</span></td>
          </tr>
          <tr>
            <td>isSm</td>
            <td>>=600</td>
            <td><span class="td-del">>=768</span></td>
          </tr>
          <tr>
            <td>isXs</td>
            <td>&lt;600</td>
            <td><span class="td-del">&lt;768</span></td>
          </tr>
        </tbody>
      </table>

      <p class="warn-tip">#The size will reset after leaving the page!</p>
    </div>

    <div class="box xl-box" v-if="$vSize.isXl">xl visible: {{ $vSize.width }}</div>
    <div class="box lg-box" v-if="$vSize.isLg">lg visible: {{ $vSize.width }}</div>
    <div class="box md-box" v-if="$vSize.isMd">md visible: {{ $vSize.width }}</div>
    <div class="box sm-box" v-if="$vSize.isSm">sm visible: {{ $vSize.width }}</div>
    <div class="box xs-box" v-if="$vSize.isXs">xs visible: {{ $vSize.width }}</div>
  </div>
</template>

<script>
export default {
  name: 'size',
  data () {
    return {
      isChange: false
    }
  },
  methods: {
    changeSize () {
      this.isChange = true
      this.$vSize.changeSize({
        xl: { min: 1904 },
        lg: { min: 1264 },
        md: { min: 960 },
        sm: { min: 600 },
        xs: { max: 600 }
      })
    },
    reset () {
      this.$vSize.changeSize({
        xl: { min: 1920 },
        lg: { min: 1200 },
        md: { min: 992 },
        sm: { min: 768 },
        xs: { max: 768 }
      })
    }
  },
  beforeDestroy () {
    this.reset()
  }
}
</script>

<style lang='less' scoped>
.content {
  margin-top: 50px;
  color: #888;
}
.changed-text {
  margin-left: 5px;
  font-weight: 600;
  color: #690;
}
table {
  display: inline-block;
  margin-top: 10px;
  max-width: 400px;
  td {
    padding: 4px 30px;
    font-size: 16px;
    .td-del {
      color: #F56C6C;
      text-decoration: line-through;
    }
  }
}
.warn-tip {
  font-weight: 600;
  font-size: 14px;
  color: #FFA100;
}
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
