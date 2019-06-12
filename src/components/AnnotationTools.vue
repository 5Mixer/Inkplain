<template>
	<div class="tool-container">
		<span class="tool-button" @click="toolSelect('pen')">Pen</span>
		<span class="tool-button" @click="toolSelect('highlighter')">Highlighter</span>
		<span class="tool-button" @click="toolSelect('eraser')">Eraser</span>
		<span class="tool-button" @click="clearCanvas()">Clear</span>
		
		<span v-bind:class="{ red: recording }" class="tool-button" @click="toggleRecording">{{recording ? 'Recording' : 'Record'}}</span>
		<span v-bind:class="{ blue: micActive }" class="tool-button" @click="toggleMicrophone">{{micActive ? 'Mic On' : 'Mic Off'}}</span>

		<colour-picker @colourPick="colourPick"></colour-picker>
		<span class="tool-button">
			<input type="range" min="1" max="30" value="2" class="thicknessSlider" v-on:input="brushWidth(this.value)">
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
	props: ['recording', 'micActive'],
	methods: {
		colourPick: function (colour) {
			this.$emit("colourPick", colour)
		},
		toggleRecording: function () {
			this.$emit("toggleRec")
		},
		toggleMicrophone: function () {
			this.$emit("toggleMic")
		},
		toolSelect: function (tool) {
			this.$emit("toolSelect", tool)
		},
		clearCanvas: function () {
			this.$emit("clearCanvas")
		},
		brushWidth: function (width) {
			console.log("spook")
			this.$emit("brushWidth", width)
		}.bind(this)
	}
}
</script>

<style scoped lang="scss">
.tool-container {
	background-color: #eee;
	height: 100%;
	border-radius: 3px;
	margin-top: 1em;
	padding-top: 10px;
	padding-bottom: 10px;
	text-align: center;
	box-sizing: border-box;
}
.tool-button {
	display: inline-block;
	cursor: pointer;

	background-color: #ddd;
	text-align: center;

	margin: 5px;
	margin-top: 0;
	margin-bottom: 0;
	padding: 20px;
	
	width: 110px;
	height: 20px;
	line-height: calc(10px - .5em);

	font-size: 1em;

	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
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
	vertical-align: top;
	margin-top:0px;
	position: relative;
	top: -.5em;
}
</style>
