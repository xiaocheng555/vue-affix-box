<template>
  <div>
    <h2>$vSize prop</h2>
    <p>#Change the screen size to see the changes</p>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Value</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          :class="$vSize[item.name] === true ? 'active' : ''">
          <td>
            {{ item.name }}
            <span class="td-highlight" v-if="$vSize[item.name] === true">（current size）</span>
          </td>
          <td>
            <span class="td-type">{{ item.type }}</span>
          </td>
          <td>{{ $vSize[item.name] }}</td>
          <td>{{ item.screen }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      data: [
        {
          name: 'isXl',
          type: 'Boolean',
          screen: '≥1920px'
        },
        {
          name: 'isLg',
          type: 'Boolean',
          screen: '≥1200px'
        },
        {
          name: 'isMd',
          type: 'Boolean',
          screen: '≥992px'
        },
        {
          name: 'isSm',
          type: 'Boolean',
          screen: '≥768px'
        },
        {
          name: 'isXs',
          type: 'Boolean',
          screen: '<768px'
        },
        {
          name: 'width',
          type: 'Number',
          screen: 'window width'
        }
      ]
    }
  }
}
</script>

<style lang='less' scoped>
table {
  border: 1px solid #ddd;
  border-bottom: 0;
  width: 100%;
  border-collapse: collapse;
  tr.active {
    background: #eee;
  }
  td, th {
    height: 42px;
    padding: 8px 16px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    text-align: left;
  }
  td .td-highlight {
    margin-left: 5px;
    font-weight: 600;
    color: #1867c0;
  }
  td .td-type {
    color: #690;

  }
}
</style>
