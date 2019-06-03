<script>
  import regions from '@/data.js'

  export default {
    name: 'CountrySelect',
    props: {
      country: String,
      topCountry: String,
      countryName: Boolean,
      whiteList: Array,
      blackList: Array,
      className: String,
      shortCodeDropdown: Boolean,
      placeholder: {
        type: String,
        default: 'Select Country'
      },
      usei18n: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      countries() {
        let countryList = regions.filter((region) => {
          if (this.countryName) {
            return region.countryName !== this.firstCountry
          } else {
            return region.countryShortCode !== this.firstCountry
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
        if (this.$i18n && this.usei18n) {
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
      firstCountry() {
        if(this.countryName) {
          if(this.topCountry.length === 2 ) {
            const regionObj = regions.find((region) => {
              return region.countryShortCode === this.topCountry
            })
            return regionObj.countryName
          } else {
            return this.topCountry
          }
        }
        if (this.topCountry) {
          return this.topCountry
        }
        return ''
      },
      name() {
        return this.name
      },
      value() {
        return this.country
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
            return region.countryName === this.firstCountry
          } else {
            return region.countryShortCode === this.firstCountry
          }
        })
        if (this.$i18n && this.usei18n) {
          return this.$t(regionObj.countryName)
        }
        return this.shortCodeDropdown ? regionObj.countryShortCode : regionObj.countryName
      }
    }
  }
</script>

<template>
  <select @change="onChange($event.target.value)" :class="className">
    <option value="">{{ placeholder }}</option>
    <option v-if="topCountry" :value="firstCountry" :selected="country === firstCountry">{{topCountryName()}}</option>
    <option v-for="(region, index) in countries" :value="region[valueType]" :selected="country === region[valueType]" :key="index">{{ shortCodeDropdown ? region.countryShortCode : region.countryName }}</option>
  </select>
</template>
