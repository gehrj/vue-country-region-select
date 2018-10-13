<script>
  import regions from 'country-region-data'
  export default {
    name: 'RegionSelect',
    props: ['country', 'region', 'defaultRegion'],
    data: () => ({
      shownRegions: [],
      regions,
      alreadyMounted: false
    }),
    mounted() {
      if (this.country) {
        this.getRegionWithCountry()
      } else {
        const regionObject = regions.find((elem) => {
          return elem.countryShortCode === this.defaultRegion || 'US'
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
          return elem.countryShortCode === this.country
        })
        this.shownRegions = regionObject.regions.map((elem) => elem)
      }
    },
    watch: {
      country(oldVal, newVal) {
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