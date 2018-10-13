<template>
  <div id="app">
  </div>
</template>

<script>
import countrySelect from '@/components/country-select'
import regionSelect from '@/components/region-select'
export { countrySelect, regionSelect }
export default {
  name: 'app',
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
