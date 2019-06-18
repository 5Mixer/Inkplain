
<template>
	<div>
		<h1>Videos</h1>
		<div v-for="video in videos">
			<router-link :to="{ name: 'playback', params: { id: video } }">{{video}}</router-link>
		</div>
	</div>
</template>

<script>
const axios = require('axios')

export default {
	name: 'videos',
	components: {
	},
	data: function () {
		return {
			videos: []
		}
	},
	methods: {
	},
	mounted: function() {
		console.log(this.$route.params.id)
		axios.get(`http://localhost:3000/listing/`).then(function(response) {
			this.videos = response.data
		}.bind(this))
	
	}
}
</script>
