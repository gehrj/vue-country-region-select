# Vue-Country-Region-Select ![CI status](https://img.shields.io/badge/build-passing-brightgreen.svg)

Vue-Country-Region-Select provides a pair of Vue components that will allow you to easily put a country and region dropdown in your project that will work together or standalone.

## Installation
`npm install vue-country-region-select --save`

## Usage
Here is a sample use case of how you would use vue-country-region-select in your vue project. You can alternatively store the data in a store somewhere. Country and Region values will be returned in their short code values. 

Ex. country: 'US' and region: 'IL'
```javascript
import Vue from 'vue'
import { countrySelect, regionSelect } from 'vue-country-region-select'

export default Vue.extend({
  components: { countrySelect, regionSelect},
  data: () => ({
    country: '',
    region: ''
  })
})

<template>
  <country-select v-model="country" :country="country" topCountry="US" />
  <region-select v-model="region" :country="country" :region="region" />
</template>
```

## Options
Here are the available attributes that can be used with the provided components.

```<country-select />```

Parameter | Required? | Default | Type | Description
--------- | --------- | ------- | -------- | ----------
v-model | yes | ''| string | The data binding for your component
country | yes | '' | string | Make this tied to the same piece of data as v-model
topCountry | no | '' | string | By providing this value you will tell component what country to put at the top of the dropdown list for easy selection. Make sure to use country short code. So for United states you would provide 'US'.

```<region-select /> ```

Parameter | Required? | Default | Type | Description
--------- | --------- | ------- | -------- | ----------
v-model | yes | ''| string | The data binding for your component
region | yes | '' | string | Make this tied to the same piece of data as v-model
country | no | '' | string | This tells the component what country to grab the list of displayed regions from. To have it work in tandem with country component provide it the variable that is tied to the v-model of the country-select component.
defaultRegion | no | 'US' | string | This allows you to set a default region when choosing not to use the country attribute. It will be set to regions of the United States if not provided.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)