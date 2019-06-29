<template>
	<div class="boardContainer" @mouseup="scrubbing = false" @mousemove="handleScrub" ref="player">
		<canvas ref="board"></canvas>

		<div v-show="!recording && initialRecord">

			<div v-if="this.annotationLogic.playback != undefined" class="playControls unselectable">
				<span v-show="playing" @click="playToggle">
					<svg id="i-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
						<path d="M10 2 L10 30 24 16 Z" />
					</svg>
				</span>
				<span v-show="!playing" @click="playToggle">
					<svg id="i-pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
						<path d="M23 2 L23 30 M9 2 L9 30" />
					</svg>
				</span>

				<span class="time">
					{{ humanTime(this.annotationLogic.playback.time).mins }}:{{ humanTime(this.annotationLogic.playback.time).secs }}
					/
					{{ humanTime(this.annotationLogic.playback.lengthTime).mins }}:{{ humanTime(this.annotationLogic.playback.lengthTime).secs }}
				</span>

			</div>

			<audio src="" ref="recordedAudio" controls class="slider" v-show="false"></audio>
			
			<div class="scrubber" @mousedown="scrubbing = true; handleScrub($event)" ref="scrubber">
				<span class="progress" ref="progress"></span>
			</div>

			<span @click="fullscreen">
				<svg id="i-fullscreen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
					<path d="M4 12 L4 4 12 4 M20 4 L28 4 28 12 M4 20 L4 28 12 28 M28 20 L28 28 20 28" />
				</svg>

			</span>
			
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
			annotationLogic: {},
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
				const rect = this.$refs.scrubber.getBoundingClientRect()
				this.annotationLogic.setPlayProgress((e.clientX - rect.left)/this.$refs.scrubber.clientWidth)
			}
		},
		humanTime: function (ms) {
			var secs = ms / 1000
			var hours = Math.floor(secs / ( 60 * 60))
			var mins = Math.floor(secs/60) % 60
			var secs = Math.floor (secs % 60)
			return { 
				//hours: (hours < 10 ? "0" : "") + hours,
				mins: (mins < 10 ? "0" : "") + mins,
				secs: (secs < 10 ? "0" : "") + secs
			}
		},
		fullscreen: function () {
			this.$refs['player'].mozRequestFullScreen()
		}
	},
	mounted: function() {
		this.context = this.$refs['board'].getContext('2d')

		this.$refs['board'].width = 1920 //this.$refs['board'].parentElement.clientWidth 
		this.$refs['board'].height = 1080 //this.$refs['board'].parentElement.clientHeight

		this.annotationLogic = new AnnotationCanvas(this.$refs['board'], this.$refs['recordedAudio'], this.$refs['progress'])
		this.annotationLogic.exportVideo = function (video) {
			this.bus.$emit('publish', video)
		}.bind(this)
		this.recording = this.annotationLogic.recorder.recording

		this.bus.$on('recToggle', () => { this.initialRecord = true; this.annotationLogic.recToggle(); } )
		this.bus.$on('micToggle', () => { this.annotationLogic.micToggle() } )
		this.bus.$on('toolSelect', (tool) => { this.annotationLogic.toolSelect(tool) })
		this.bus.$on('colourPick', (colour) => { this.annotationLogic.brushColourWithLookup(colour) })
		this.bus.$on('clearCanvas', () => { this.annotationLogic.clearCanvas() } )
		this.bus.$on('brushWidth', (width) => { this.annotationLogic.brushWidth(width) })
		this.bus.$on('save', (title, description) => { this.annotationLogic.save(title, description) })
		this.bus.$on('load', (data) => { this.annotationLogic.load(data) })
		this.bus.$on('enablePlayback', () => {this.initialRecord = true})
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
	display: block;
	margin-left: auto;
	margin-right: auto;
	touch-action: none;
}
.media-button {
	display: inline-block;
	background: grey;
	color: white;
	font-weight: bold;
	padding: 2px;
	padding-left: 10px;
	padding-right: 10px;
	min-width: 35px;
	text-align: center;
	cursor: pointer;
}
.boardContainer {
	height: calc(56.25vw - 10vw);
	max-height: calc(100vh - 80px);
}
.scrubber {
	height: 15px;
	background-color: #999;
	width: calc(100% - 250px);
	display: inline-block;
	margin: 0;
	padding: 0;
	line-height: 32px;
	vertical-align: top;
}
.progress {
	display:block;
	height: 100%; 
	pointer-events: none;
	background: #444;
	border-right: solid 6px #c3dff7;
}
.time {
}
.playControls {
	width: 170px;
	height: 32px;
	line-height: 32px;
	vertical-align: center;
	display: inline-block;
}
</style>
