<script>
  import regions from 'country-region-data'

  export default {
    name: 'CountrySelect',
    props: {
      country: String,
      topCountry: String,
      countryName: String,
      whiteList: Array,
      blackList: Array,
      className: String,
      placeholder: {
        type: String,
        default: 'Select Country'
      }
    },
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
        if (this.$i18n) {
          countryList = countryList.map((country) => {
            let localeCountry = Object.assign({ }, country)
            localeCountry.countryName = this.$t(country.countryName)
            return localeCountry
          })
          countryList.sort((country1, country2) => {
            return (country1.countryName > country2.countryName) ? 1 : -1
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
        if (this.$i18n) {
          return this.$t(regionObj.countryName)
        }
        return regionObj.countryName
      }
    }
  }
</script>

<template>
  <select @change="onChange($event.target.value)" :class="className">
    <option value="">{{ placeholder }}</option>
    <option v-if="topCountry" :value="topCountry" :selected="country === topCountry">{{topCountryName()}}</option>
    <option v-for="(region, index) in countries" :value="region[valueType]" :selected="country === region[valueType]" :key="index">{{region.countryName}}</option>
  </select>
</template>
