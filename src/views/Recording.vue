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
					<a :href="'inkplain.com/play/' + publishId">inkplain.com/play/{{publishId}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AnnotationTools from '@/components/AnnotationTools.vue'
import AnnotationCanvas from '@/components/Canvas.vue'
const axios = require('axios')
import Vue from 'vue'
export default {
	name: 'home',
	components: {
		AnnotationTools, AnnotationCanvas
	},
	data: function () {
		return {
			bus: new Vue(),
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
			this.bus.$emit("colourPick", colour)
		},
		toggleRec: function () {
			this.bus.$emit("recToggle")
			this.recording = !this.recording
			this.initialRecord = true
		},
		toggleMic: function () {
			this.bus.$emit("micToggle")
			this.micActive = !this.micActive
		},
		toolSelect: function (tool) {
			this.bus.$emit("toolSelect",tool)
		},
		clearCanvas: function () {
			this.bus.$emit("clearCanvas")
		},
		brushWidth: function (width) {
			this.bus.$emit("brushWidth", width)
		},
		save: function () {
			this.bus.$emit("save", this.title, this.description)
		}
	},
	mounted: function () {
		if (this.bus == undefined)
			this.bus = new Vue()
		this.bus.$on("publish", (video) => {
			axios.post('/api/video', video, { withCredentials: true }).then((response) => {
				if (response.data.success)
					this.$router.push({ name: 'playback', params: { id: response.data.id } })
			})
		})
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
	display: inline-block;
	border: none;
	border-radius: 3px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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
