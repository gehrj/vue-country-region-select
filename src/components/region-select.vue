<script>
  import regions from 'country-region-data'
  export default {
    name: 'RegionSelect',
    props: ['country', 'region', 'defaultRegion', 'countryName'],
    data: () => ({
      shownRegions: [],
      regions,
      alreadyMounted: false
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
        const regionObject = regions.find((elem) => {
          if (this.countryName) {
            return elem.countryName === findRegion
          } else {
            return elem.countryShortCode === findRegion
          }
        })
        this.shownRegions = regionObject.regions.map((elem) => elem)
      }
      this.alreadyMounted = true
    },
    methods: {
      onChange(region) {
        this.$emit('input', region)
      },
      getRegionWithCountry() {
        const regionObject = regions.find((elem) => {
          if (this.countryName) {
            return elem.countryName === this.country
          } else {
            return elem.countryShortCode === this.country
          }
        })
        this.shownRegions = regionObject.regions.map((elem) => elem)
      }
    },
    watch: {
      country() {
        if (this.alreadyMounted) { this.onChange('') }
        if (this.country) {
          this.getRegionWithCountry()
        } else {
          this.shownRegions = []
        }
        this.alreadyMounted = true
      }
    }
  }
</script>

<template>
  <select @change="onChange($event.target.value)">
    <option value="">Select Region</option>
    <option v-for="(place, index) in shownRegions" v-bind:key="index" :value="place.shortCode" :selected="region === place.shortCode">{{place.name}} </option>
  </select>
</template>