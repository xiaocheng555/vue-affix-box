import VueAffixBox from './vue-affix-box.vue'

Object.defineProperty(VueAffixBox, 'install', {
  configurable: false,
  enumerable: false,
  value (Vue, options) {
    // Set default prop values for VueAffixBox
    for (const key in options) {
      if (key in VueAffixBox.props) {
        VueAffixBox.props[key].default = options[key]
      }
    }
    Vue.component('vue-affix-box', VueAffixBox)
  }
})

export default VueAffixBox
