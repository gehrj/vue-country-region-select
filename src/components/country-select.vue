<script>
  import Vue from 'vue'
  import regions from 'country-region-data'

  export default Vue.extend({
    name: 'CountrySelect',
    props: ['country', 'topCountry'],
    computed: {
      countries() {
        return regions.filter((region) => {
          return region.countryShortCode !== this.topCountry
        })
      }
    },
    methods: {
      onChange(country) {
        this.$emit('input', country)
      },
      topCountryName() {
          const regionObj = regions.find((region) => {
              return region.countryShortCode === this.topCountry
          })
          return regionObj.countryName
      }
    }
  })
</script>

<template>
  <select @change="onChange($event.target.value)">
    <option value="">Select Country</option>
    <option v-if="topCountry" :value="topCountry" :selected="country === topCountry">{{topCountryName()}}</option>
    <option v-for="(region, index) in countries" :value="region.countryShortCode" :selected="country === region.countryShortCode" :key="index">{{region.countryName}}</option>
  </select>
</template>