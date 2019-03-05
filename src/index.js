import CountrySelect from '@/components/country-select.vue'
import RegionSelect from '@/components/region-select.vue'

const install = function (Vue) {
    const components = { CountrySelect, RegionSelect }
    Object.keys(components).forEach(name => {
        Vue.component(name, components[name])
    })
}

const VueCountryRegionSelect = { CountrySelect, RegionSelect, install }

export default VueCountryRegionSelect
export { CountrySelect, RegionSelect }
