import base from './rollup.config.base'
import { terser } from 'rollup-plugin-terser'

const config = Object.assign({}, base, {
  output: {
    format: 'iife',
    file: './dist/vue-affix-box.min.js',
    name: 'VueAffixBox',
    sourcemap: false
  }
})

config.plugins.push(terser())

export default config
