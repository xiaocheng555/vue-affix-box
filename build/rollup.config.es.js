import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    format: 'es',
    file: './dist/vue-affix-box.esm.js',
    name: 'vue-affix-box',
    sourcemap: false
  }
})

export default config
