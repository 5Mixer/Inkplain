<template>
	<div class="tool-container">
		<span class="tool-button" @click="toolSelect('pen')" v-bind:class="{ active: activeTool == 'pen'}" >
			<object class="toolImage" ref="pen" :data="penSvg" type="image/svg+xml"></object>
		</span>
		<span class="tool-button" @click="toolSelect('highlighter')" v-bind:class="{ active: activeTool == 'highlighter'}" >
			<object class="toolImage" ref="highlighter" :data="highlighterSvg" type="image/svg+xml"></object>
		</span>
		<span class="tool-button" @click="toolSelect('eraser')" v-bind:class="{ active: activeTool == 'eraser'}" >
			<object class="toolImage" :data="eraserSvg" type="image/svg+xml"></object>
		</span>
		<span class="tool-button" @click="clearCanvas()">Clear</span>

		
		<span v-bind:class="{ red: recording }" class="tool-button" @click="toggleRecording">{{recording ? 'Recording' : 'Record'}}</span> <span v-bind:class="{ blue: micActive }" class="tool-button" @click="toggleMicrophone">{{micActive ? 'Mic On' : 'Mic Off'}}</span>

		<colour-picker @colourPick="colourPick"></colour-picker>
		<span class="tool-button">
			<input type="range" min="1" max="30" value="2" class="thicknessSlider" v-on:input="brushWidth">
		</span>
	</div>
</template>

<script>
import ColourPicker from "@/components/ColourPicker.vue"

export default {
	name: 'annotation-tools',
	components: {
		ColourPicker
	},
	data: function () {
		return {
			activeTool: 'pen',
			highlighterSvg: require('@/assets/highlighter.svg'),
			penSvg: require('@/assets/pen.svg'),
			eraserSvg: require('@/assets/eraser.svg'),
		}
	},
	props: ['recording', 'micActive'],
	methods: {
		setToolsColour: function (colour) {
			this.$refs['pen'].getSVGDocument().getElementById("penEnd").style.fill = colour
			this.$refs['pen'].getSVGDocument().getElementById("penLine").style.stroke = colour
			
			this.$refs['highlighter'].getSVGDocument().getElementById("highlighterEnd").style.fill = colour
			this.$refs['highlighter'].getSVGDocument().getElementById("highlighterLine").style.stroke = colour
		},
		colourPick: function (colour) {
			this.setToolsColour(colour)
			this.$emit("colourPick", colour)
		},
		toggleRecording: function () {
			this.$emit("toggleRec")
		},
		toggleMicrophone: function () {
			this.$emit("toggleMic")
		},
		toolSelect: function (tool) {
			this.activeTool = tool
			this.$emit("toolSelect", tool)
		},
		clearCanvas: function () {
			this.$emit("clearCanvas")
		},
		brushWidth: function (e) {
			this.$refs['pen'].getSVGDocument().getElementById("penLine").style["stroke-width"] = e.target.value /4
			this.$refs['highlighter'].getSVGDocument().getElementById("highlighterLine").style["stroke-width"] = e.target.value /4

			this.$emit("brushWidth", e.target.value)
		}
	}
}
</script>

<style scoped lang="scss">
.tool-container {
	/* background-color: #eee; */
	height: 100%;
	border-radius: 3px;
	padding-bottom: 10px;
	text-align: center;
	box-sizing: border-box;
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

	overflow: hidden;
}
.active {
	background: #4286f433;
}
.red {
	border: solid 1px red;
    box-shadow: 0 0 3px red;
	font-weight: bold;
}
.blue {
	border: solid 1px blue;
    box-shadow: 0 0 3px blue;
	font-weight: bold;
}
.thicknessSlider {
	width: 100%;
}
.toolImage {
	/*transition: filter 0.1s ease-in-out;*/
	-webkit-filter: drop-shadow( 0px 2px 5px rgba(50, 50, 50, .8));
	filter: 		drop-shadow( 0px 2px 5px rgba(50, 50, 50, .8));
	pointer-events: none;
	
	position: relative;
	left: 40px;
	transition: left .1s ease-in-out;
}
.tool-button:hover>.toolImage{
	/*-webkit-filter: drop-shadow( 2px 2px 9px rgba(50, 50, 50, .7));
	filter: 		drop-shadow( 2px 2px 9px rgba(50, 50, 50, .7));
	
	transition: filter 0.1s ease-in-out;*/
	transition: left .1s ease-in-out;
}
.active>.toolImage{
	-webkit-filter: drop-shadow( 2px 2px 9px rgba(50, 50, 50, .7));
	filter: 		drop-shadow( 2px 2px 9px rgba(50, 50, 50, .7));
	
	transition: filter 0.1s ease-in-out;
	transition: left .1s ease-in-out;
	left: 0px !important;
}
</style>
