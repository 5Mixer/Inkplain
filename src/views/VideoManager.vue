
<template>
  <div class="about">
	  <h2>User: {{ user.email }}</h2>

	  <h2>Your videos ({{ videos.length }})</h2>
	  <div v-for="video in videos" class="video">
		  <router-link :to="{ name: 'playback', params: { id: video.id } }">{{ video.title }}</router-link>
		  <div class="meta" :title="'Uploaded ' + fullHumanDate(video.uploadDate)">{{new Date(video.uploadDate).toLocaleDateString("en-US") }}</div>
		  <button class="red button" @click="deleteVideo(video)">Delete</button>
	  </div>
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
			user: {},
			videos: []
		}
	},
	methods: {
		fullHumanDate : function (rawTime) {
			return new Date(rawTime).toLocaleString("en-AU")
		},
		filter: function (video) {
			return video.title.indexOf(this.searchQuery) != -1
		},
		deleteVideo: function (video) {
			axios.post(`api/deletevideo/`, video, { withCredentials: true }).then((response) => {
				if (response.data.success) {
					// If successful, remove on the client side without redownloading video listing
					this.videos.splice(this.videos.indexOf(video), 1)
				} else {
				}
			})
		}
	},
	mounted: function() {
		axios.get(`api/userlisting/`, { withCredentials: true }).then((response) => {
			this.videos = response.data
		})
		axios.get(`api/user/`, { withCredentials: true }).then((response) => {
			this.user = response.data
		})
	}
}
</script>
<style>
.meta {
	color: gray;
	font-size: .9em;
}
.red {
	background-color: #ef5656;
	color: black;
}
</style>
