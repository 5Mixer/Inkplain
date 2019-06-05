<template>
	<div>
		<canvas ref="board"></canvas>
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
	}, props: ['bus'],
	mounted: function() {
		this.context = this.$refs['board'].getContext('2d')
		console.log(this.$refs['board'])

		// Resize the canvas to fit its parent's width.
		// Normally you'd use a more flexible resize system.
		this.$refs['board'].width = this.$refs['board'].parentElement.clientWidth
		this.$refs['board'].height = this.$refs['board'].parentElement.clientHeight

		this.annotationLogic = new AnnotationCanvas(this.$refs['board'])

		this.bus.$on('recToggle', () => { this.annotationLogic.recToggle() } )
		console.log("AHHHHHHHHHHHHHHHHH")
	}
}
</script>
