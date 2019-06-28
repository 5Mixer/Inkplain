
<template>
	<div class="browse">
		<h1>Videos</h1>
		<div>
			<input type="text" placeholder="Search videos" v-model="searchQuery">
		</div>
		<div v-for="video in videos" class="video" v-show="filter(video)">
			<router-link :to="{ name: 'playback', params: { id: video.id } }">{{ video.title }}</router-link>
			<div class="meta" :title="'Uploaded ' + fullHumanDate(video.uploadDate)">{{new Date(video.uploadDate).toLocaleDateString("en-US") }}</div>
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
			videos: [],
			searchQuery: ""
		}
	},
	methods: {
		fullHumanDate : function (rawTime) {
			return new Date(rawTime).toLocaleString("en-US")
		},
		filter: function (video) {
			return video.title.indexOf(this.searchQuery) != -1
		}
	},
	mounted: function() {
		console.log(this.$route.params.id)
		axios.get(`http://localhost:3000/listing/`).then(function(response) {
			this.videos = response.data
		}.bind(this))
	
	}
}
</script>

<style>
.browse {
	width: 100%;
}
.video {
	display: inline-block;
	border: solid 1px gray;
	margin: 2em;
	margin-left: 0em;
	padding: 1em;
	width: calc(50% - 2em);
}
.meta {
	color: gray;
	font-size: .9em;
}
</style>
