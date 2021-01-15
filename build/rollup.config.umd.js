import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    format: 'umd',
    file: './dist/vue-affix-box.umd.js',
    name: 'vue-affix-box',
    sourcemap: false
  }
})

export default config
