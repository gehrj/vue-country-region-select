<template>
  <div id="app">
    <country-select v-model="country" :country="country" topCountry="US" />
    <region-select v-model="region" :country="country" :region="region" />
  </div>
</template>

<script>
import CountrySelect from '@/components/country-select'
import RegionSelect from '@/components/region-select'

// ***** For demo testing only *****
export default {
  name: 'app',
  components: {
    CountrySelect,
    RegionSelect
  },
  data: () => ({
    country: '',
    region: ''
  })
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
