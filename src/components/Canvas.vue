<template>
	<div class="boardContainer">
		<canvas ref="board"></canvas>
		<audio src="" ref="recordedAudio" controls class="slider" v-show="!recording"></audio>
	</div>
</template>

<script>
import {AnnotationCanvas} from "@/video/app.js"
export default {
	name: 'annotation-canvas',
	data() {
		return {
			canvas: undefined
		}
	}, props: ['bus', 'recording'],
	mounted: function() {
		this.context = this.$refs['board'].getContext('2d')

		// Resize the canvas to fit its parent's width.
		// Normally you'd use a more flexible resize system.
		let scale = 55
		this.$refs['board'].width = 1920 //this.$refs['board'].parentElement.clientWidth //scale * 16;
		this.$refs['board'].height = 1080 //this.$refs['board'].parentElement.clientHeight //scale * 9;

		this.annotationLogic = new AnnotationCanvas(this.$refs['board'], this.$refs['recordedAudio'])
		this.recording = this.annotationLogic.recorder.recording

		this.bus.$on('recToggle', () => { this.annotationLogic.recToggle() } )
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
	max-height: calc(100vh - 150px);
}
</style>
