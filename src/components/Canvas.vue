<template>
	<div class="boardContainer" @mouseup="scrubbing = false">
		<canvas ref="board"></canvas>

		<div class="scrubber" @mousedown="scrubbing = true" @mousemove="handleScrub">
			<span class="progress" ref="progress"></span>
		</div>
		<div class="media-button" @click="playToggle">{{playing ? '►' : '| |' }}</div>

		<div v-show="!recording && initialRecord">
		
			<audio src="" ref="recordedAudio" controls class="slider" v-show="!recording && initialRecord"></audio>
		</div>
	</div>
</template>

<script>
import {AnnotationCanvas} from "@/video/app.js"
export default {
	name: 'annotation-canvas',
	data() {
		return {
			initialRecord: false,
			playing: true,
			playback: {},
			progress: 0.,
			scubbing: false,
			canvas: undefined
		}
	}, props: ['bus', 'recording'],
	methods: {
		playToggle: function () {
			this.annotationLogic.playToggle()
			this.playing = !this.playing
		},
		handleScrub: function (e) {
			if (this.scrubbing) {
				const rect = e.target.getBoundingClientRect()
				this.annotationLogic.setPlayProgress((e.clientX - rect.left)/e.target.clientWidth)
			}
		}
	},
	mounted: function() {
		this.context = this.$refs['board'].getContext('2d')

		this.$refs['board'].width = 1920 //this.$refs['board'].parentElement.clientWidth 
		this.$refs['board'].height = 1080 //this.$refs['board'].parentElement.clientHeight

		this.annotationLogic = new AnnotationCanvas(this.$refs['board'], this.$refs['recordedAudio'], this.$refs['progress'])
		this.recording = this.annotationLogic.recorder.recording

		this.bus.$on('recToggle', () => { this.annotationLogic.recToggle(); this.initalRecord = true } )
		this.bus.$on('micToggle', () => { this.annotationLogic.micToggle() } )
		this.bus.$on('toolSelect', (tool) => { this.annotationLogic.toolSelect(tool) })
		this.bus.$on('colourPick', (colour) => { this.annotationLogic.brushColourWithLookup(colour) })
		this.bus.$on('clearCanvas', () => { this.annotationLogic.clearCanvas() } )
		this.bus.$on('brushWidth', (width) => { this.annotationLogic.brushWidth(width) })
		this.bus.$on('save', () => { this.annotationLogic.save() })
	}
}
</script>
<style scoped>
audio {
	width: 100%;
	margin-left: auto;
	margin-right: auto;
}
canvas {
	height: 100%;
	border: 1px solid black;
	background-color: blue;
	display: block;
	margin-left: auto;
	margin-right: auto;
}
.media-button {
	display: inline-block;
	background: grey;
	color: white;
	font-weight: bold;
	padding: 2px;
	padding-left: 10px;
	padding-right: 10px;
	width: 35px;
	text-align: center;
	cursor: pointer;
}
.boardContainer {
	height: calc(56.25vw - 15vw);
	max-height: calc(100vh - 80px);
}
.scrubber {
	height: 1em;
	background-color: #999;
}
.progress {
	display:block;
	height: 100%;
	pointer-events: none;
	background: #444;
}
</style>
