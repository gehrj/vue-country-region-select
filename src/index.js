import Vue from 'vue'
import countrySelect from '@/components/countrySelect.vue'
import regionSelect from '@/components/regionSelect.vue'

const components = { countrySelect, regionSelect }

Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
})

export default components