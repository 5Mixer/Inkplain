<template>
  <div class="about">
	  {{ user }}
  </div>
</template>
<script>
const axios = require('axios')

export default {
	name: 'about',
	components: {
		
	},
	data: function () {
		return {
			user: {}
		}
	},
	methods: {
	},
	mounted: function() {
		fetch(`http://localhost:3000/user/`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async function(response){
				this.user = await response.json()
			}.bind(this))
	}
}
</script>
