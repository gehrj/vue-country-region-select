import Vue from 'vue'
import countrySelect from '@/components/country-select.vue'
import regionSelect from '@/components/region-select.vue'

const components = { countrySelect, regionSelect }

Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
})

export default components