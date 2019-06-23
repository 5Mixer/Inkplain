<template>
	<div>
		<div class="recordingSection left">
			<annotation-canvas :bus="bus" :recording="recording" :micActive="micActive"></annotation-canvas>
		</div>
		<div class="recordingSection right">
			<annotation-tools :recording="recording" @toggleMic="toggleMic" @toggleRec="toggleRec" @colourPick="changeColour" @clearCanvas="clearCanvas" @toolSelect="toolSelect" @brushWidth="brushWidth"></annotation-tools>
			<button class="tool-button" @click="save">Publish</button>
		</div>
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
			recording: false,
			micActive: false
		}
	},
	methods: {
		changeColour: function (colour) {
			bus.$emit("colourPick", colour)
		},
		toggleRec: function () {
			bus.$emit("recToggle")
			this.recording = !this.recording
		},
		toggleMic: function () {
			bus.$emit("micToggle")
			this.micActive = !this.micActive
		},
		toolSelect: function (tool) {
			bus.$emit("toolSelect",tool)
		},
		clearCanvas: function () {
			bus.$emit("clearCanvas")
		},
		brushWidth: function (width) {
			bus.$emit("brushWidth", width)
		},
		save: function () {
			bus.$emit("save")
		}
	}
}
</script>

<style scoped>
annotation-tools {
	height: 90px;
}
.tool-button {
	display: block;
	cursor: pointer;

	background-color: white;
	text-align: center;

	margin: 5px;
	margin-top: 0;
	padding: 20px;
	
	line-height: calc(10px - .5em);

	font-size: 1em;
	border: 1px solid gray;

	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
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
	margin-left: 5px;
	float: left;
	height: 50%;
	display: block;
	background: black;
}
.right {
	width: 10vw;
	min-width: 150px;
	height: 100%;
	display: inline-block;
	vertical-align: top;

}
</style>
