import Vue from 'vue'
import countrySelect from '@/components/countrySelect'
import regionSelect from '@/components/regionSelect'

const components = { countrySelect, regionSelect }

Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
})

export default components