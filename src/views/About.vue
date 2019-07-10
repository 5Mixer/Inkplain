<template>
  <div class="about">
	  {{ user }}
	  {{ count}}
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
			user: {},count:0
		}
	},
	methods: {
	},
	mounted: function() {
		axios.get(`http://localhost:3000/count/`, { withCredentials: true }).then(function(response) {
			this.count = response.data
		}.bind(this))
	
		fetch(`http://localhost:3000/user/`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async function(response){
				this.user = await response.json()
			}.bind(this))

		/*fetch(`http://localhost:3000/count/`, {
			method: 'GET',
			credentials: 'include',
		})
			.then(async function(response){
				this.count = await response.text()
			}.bind(this))
			*/

		//axios(`http://localhost:3000/user/`, {
		//	method: "get",
			//data: someJsonData,
		//	withCredentials: true
		//}).then(function(response){this.user=response.data}.bind(this))

	}
}
</script>
