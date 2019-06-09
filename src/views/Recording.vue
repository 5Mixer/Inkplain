<template>
	<div>
		<annotation-canvas :bus="bus" :recording="recording"></annotation-canvas>
		<annotation-tools :recording="recording" @toggleRec="toggleRec" @colourPick="changeColour" @clearCanvas="clearCanvas" @toolSelect="toolSelect" @brushWidth="brushWidth"></annotation-tools>
	</div>
</template>

<script>
import AnnotationTools from '@/components/AnnotationTools.vue'
import AnnotationCanvas from '@/components/Canvas.vue'
import Vue from 'vue'
const bus = new Vue()

export default {
	name: 'home',
	components: {
		AnnotationTools, AnnotationCanvas
	},
	data: function () {
		return {
			bus: bus,
			recording: false
		}
	},
	methods: {
		changeColour: function (colour) {
			bus.$emit("colourPick", colour)
		},
		toggleRec: function () {
			bus.$emit("recToggle")
			this.recording = !this.recording
			console.log(this.recording)
		},
		toolSelect: function (tool) {
			bus.$emit("toolSelect",tool)
		},
		clearCanvas: function () {
			bus.$emit("clearCanvas")
		},
		brushWidth: function (width) {
			bus.$emit("brushWidth", width)
		}
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
</style>
