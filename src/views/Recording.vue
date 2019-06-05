<template>
	<div>
		<h1>Record</h1>		
		<annotation-canvas :bus="bus"></annotation-canvas>
		<annotation-tools @toggleRec="toggleRec" @colourPick="changeColour"></annotation-tools>			
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
			bus: bus
		}
	},
	methods: {
		changeColour: function (colour) {
		},
		toggleRec: function () {
			bus.$emit("recToggle")
		}
	}
}
</script>

<style scoped>
annotation-tools {
	height: 90px;
}

canvas {
	width: 100%;
	height: calc(900px - 150px);
	border: 2px solid black;
}
</style>
