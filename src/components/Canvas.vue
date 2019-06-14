<template>
	<div class="boardContainer">
		<canvas ref="board"></canvas>
		<div class="scrubber">
			<span class="progress"></span>
		</div>
		<audio src="" ref="recordedAudio" controls class="slider" v-show="!recording && initialRecord"></audio>
	</div>
</template>

<script>
import {AnnotationCanvas} from "@/video/app.js"
export default {
	name: 'annotation-canvas',
	data() {
		return {
			initialRecord: false,
			canvas: undefined
		}
	}, props: ['bus', 'recording'],
	mounted: function() {
		this.context = this.$refs['board'].getContext('2d')

		this.$refs['board'].width = 1920/2 //this.$refs['board'].parentElement.clientWidth //scale * 16;
		this.$refs['board'].height = 1080/2 //this.$refs['board'].parentElement.clientHeight //scale * 9;

		this.annotationLogic = new AnnotationCanvas(this.$refs['board'], this.$refs['recordedAudio'])
		this.recording = this.annotationLogic.recorder.recording

		this.bus.$on('recToggle', () => { this.annotationLogic.recToggle(); this.initalRecord = true } )
		this.bus.$on('micToggle', () => { this.annotationLogic.micToggle() } )
		this.bus.$on('toolSelect', (tool) => { this.annotationLogic.toolSelect(tool) })
		this.bus.$on('colourPick', (colour) => { this.annotationLogic.brushColour(colour) })
		this.bus.$on('clearCanvas', () => { this.annotationLogic.clearCanvas() } )
		this.bus.$on('brushWidth', (width) => { this.annotationLogic.brushWidth(width) })
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
.boardContainer {
	height: calc(56.25vw - 15vw);
	max-height: calc(100vh - 80px);
}
.scrubber {
	height: 5px;
	background-color: blue;
}
.progress {
	display:block;
	height: 5px;
	width: 20%;
	background: red;
}
</style>
