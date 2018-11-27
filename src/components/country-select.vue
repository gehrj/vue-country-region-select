<script>
import Vue from 'vue'
import regions from 'country-region-data'

export default Vue.extend({
  name: 'CountrySelect',
  props: ['country', 'topCountry', 'countryName', 'whiteList', 'blackList'],
  computed: {
    countries() {
      let countryList = regions.filter((region) => {
        if (this.countryName) {
          return region.countryName !== this.topCountry
        } else {
          return region.countryShortCode !== this.topCountry
        }
      })
      if (this.whiteList) {
        countryList = countryList.filter((country) => {
          return this.whiteList.includes(country.countryShortCode)
        })
      }
      if (this.blackList) {
        countryList = countryList.filter((country) => {
          return !this.blackList.includes(country.countryShortCode)
        })
      }
      return countryList
    },
    valueType() {
      return this.countryName ? 'countryName' : 'countryShortCode'
    }
  },
  methods: {
    onChange(country) {
      this.$emit('input', country)
    },
    topCountryName() {
      const regionObj = regions.find((region) => {
          if (this.countryName) {
            return region.countryName === this.topCountry
          } else {
            return region.countryShortCode === this.topCountry
          }
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
    <option v-for="(region, index) in countries" :value="region[valueType]" :selected="country === region[valueType]" :key="index">{{region.countryName}}</option>
  </select>
</template>