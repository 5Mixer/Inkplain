<template>
	<div>

		<div class="recordingSection left">
			<annotation-canvas :bus="bus" :recording="recording" :micActive="micActive"></annotation-canvas>
		</div>
		<div class="recordingSection right">
			<annotation-tools :recording="recording" @toggleMic="toggleMic" @toggleRec="toggleRec" @colourPick="changeColour" @clearCanvas="clearCanvas" @toolSelect="toolSelect" @brushWidth="brushWidth"></annotation-tools>
		</div>
		
		<div class="publishSection" v-if="!recording && initialRecord">
			<div class="publishPanel">
				<h1>Publish</h1>
				<input type="text" placeholder="Video Title" v-model="title"><br>
				<textarea id="" name="" cols="70" rows="3" placeholder="Video Description" v-model="description"></textarea><br>

				<button class="tool-button" @click="save">Publish</button>
				<div v-if="published">
					<span>Accessible at </span>
					<a href="">annotatii.com/play/{{publishId}}</a>
				</div>
			</div>
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
			micActive: false,

			initialRecord: false,

			title: "",
			description: "",

			published: false,
			publishId: ''
		}
	},
	methods: {
		changeColour: function (colour) {
			bus.$emit("colourPick", colour)
		},
		toggleRec: function () {
			bus.$emit("recToggle")
			this.recording = !this.recording
			this.initialRecord = true
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
			bus.$emit("save", this.title, this.description)
		}
	}
}
</script>

<style scoped>
annotation-tools {
	height: 90px;
}
input,textarea {
	margin: 5px;
	padding: 20px;
	
	line-height: calc(10px - .5em);

	font-size: 1.4em;
	line-height: 1.6em;
	border: 1px solid gray;
	margin: auto;
	display: block;
	
	min-width: 100%;
	max-width: 100%;
}
textarea {
	font-size: 1em;
	min-height: 9em;
	max-height: 15em;
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
.publishPanel {
	min-width: 50%;
	width: 50%;
	max-width: 50%;
	margin: auto;
	display: block;
	border: solid 1px gray;
	padding: 20px;

}
.publishSection {
	margin-top: 4em;
	min-width: 100%;
	min-height: 100vh;
	display:block;
	padding: 20px;
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
}
.right {
	width: 10vw;
	min-width: 150px;
	height: 100%;
	display: inline-block;
	vertical-align: top;

}
</style>
