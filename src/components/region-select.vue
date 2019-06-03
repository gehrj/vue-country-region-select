<script>
  import regions from '@/data.js'
  export default {
    name: 'RegionSelect',
    props: {
      country: String,
      region: String,
      defaultRegion: String,
      countryName: Boolean,
      regionName: Boolean,
      className: String,
      shortCodeDropdown: Boolean,
      placeholder: {
        type: String,
        default: 'Select Region'
      },
      usei18n: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      shownRegions: [],
      regions,
    }),
    mounted() {
      if (this.country) {
        this.getRegionWithCountry()
      } else {
        let findRegion = ''
        if (this.countryName) {
          findRegion = this.defaultRegion ? this.defaultRegion : 'United States'
        } else {
          findRegion = this.defaultRegion ? this.defaultRegion : 'US'
        }
        this.getRegionWithCountry(findRegion)
      }
    },
    computed: {
      name() {
        return this.name
      },
      value() {
        return this.region
      },
      valueType() {
        return this.regionName ? 'name' : 'shortCode'
      }
    },
    methods: {
      onChange(region) {
        this.$emit('input', region)
      },
      getRegionWithCountry(country) {
        country = country || this.country
        let countryRegions = regions.find((elem) => {
          if (this.countryName) {
            return elem.countryName === country
          } else {
            return elem.countryShortCode === country
          }
        }).regions
        if (this.$i18n && this.usei18n) {
          countryRegions = countryRegions.map((region) => {
            let localeRegion = Object.assign({ }, region)
            localeRegion.name = this.$t(region.name)
            return localeRegion
          })
          countryRegions.sort((region1, region2) => {
            return (region1.name > region2.name) ? 1 : -1
          })
        }
        this.shownRegions = countryRegions
      }
    },
    watch: {
      country(newVal, oldVal) {
        if (oldVal !== '') {
          this.onChange('')
        }
        if (this.country) {
          this.getRegionWithCountry()
        } else {
          this.shownRegions = []
        }
      }
    }
  }
</script>

<template>
  <select @change="onChange($event.target.value)" :class="className">
    <option value="">{{ placeholder }}</option>
    <option v-for="(place, index) in shownRegions" v-bind:key="index" :value="place[valueType]" :selected="region === place[valueType]">{{shortCodeDropdown ? place.shortCode : place.name}}</option>
  </select>
</template>
