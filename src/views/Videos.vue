
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
			return new Date(rawTime).toLocaleString("en-AU")
		},
		filter: function (video) {
			return video.title.indexOf(this.searchQuery) != -1
		}
	},
	mounted: function() {
		axios.get(`api/listing/`, { withCredentials: true }).then(function(response) {
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
	margin: 2em;
	margin-left: 0em;
	padding: 1em;
	width: calc(30% - 2em);
	border-radius: 3px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.meta {
	color: gray;
	font-size: .9em;
}
</style>
