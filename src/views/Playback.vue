<template>
	<div>
		<h1>{{$route.params.id}}</h1>
		<div class="recordingSection left">
			<annotation-canvas :bus="bus" :recording="false" :micActive="false"></annotation-canvas>
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
			bus: bus
		}
	},
	methods: {
	},
	mounted: function() {
		console.log(this.$route.params.id)
		axios.get(`http://localhost:3000/video/${this.$route.params.id}`).then(function(response) {
			bus.$emit('load', response.data)
		})
	
	}
}
</script>

<style scoped>
annotation-tools {
	height: 90px;
}

annotation-canvas {
	width: 100%;
	height: 600px;
	border: 2px solid black;
}
.recordingSection {
	display: inline-block;
	min-height: 100%;
}
.left {
	float: left;
	height: 50%;
	display: block;
	background: black;
}
</style>
