<template>
	<div>
		<h1>{{ videoData.title }}</h1>
		<div class="recordingSection left">
			<annotation-canvas :bus="bus" :recording="false" :micActive="false"></annotation-canvas>
		</div>
		<div class="description">
			{{ videoData.description }}
		</div>
	</div>
</template>

<script>
import AnnotationCanvas from '@/components/Canvas.vue'
import Vue from 'vue'
const bus = new Vue()
const axios = require('axios')

export default {
	name: 'playback',
	components: {
		AnnotationCanvas
	},
	data: function () {
		return {
			bus: bus,
			videoData: {}
		}
	},
	methods: {
	},
	mounted: function() {
		axios.get(`api/video/${this.$route.params.id}`, { withCredentials: true }).then((response) => {
			this.videoData = response.data
			bus.$emit('load', response.data)
			bus.$emit('enablePlayback')
		})
	
	}
}
</script>

<style scoped>
annotation-canvas {
	width: 100%;
	height: 600px;
	border: 2px solid black;
}
.recordingSection {
	margin-left: 5px;
	min-height: 100%;
}
.left {
	height: 50%;
	display: inline-block;
}
.description {
	display: block;
}
</style>
