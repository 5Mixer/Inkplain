<template>
	<div class="container">
		<span class="tool-button">Pen</span>
		<span class="tool-button">Highlighter</span>
		<span class="tool-button">Eraser</span>
		<span class="tool-button">Clear Canvas</span>
		
		<span class="tool-button red" @click="toggleRecording">Record</span>

		<colour-picker @colourPick="colourPick"></colour-picker>
		<span class="tool-button">
			<input type="range" min="1" max="30" value="2" class="thicknessSlider" oninput="brushWidth(this.value)">
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
	methods: {
		colourPick: function (colour) {
			this.$emit("colourPick", colour)
		},
		toggleRecording: function () {
			this.$emit("toggleRec")
		}
	}
}
</script>

<style scoped lang="scss">
.red {
	background: "red";
}
.container {
	background-color: #eee;
	height: 100%;
	border-radius: 3px;
	padding-top: 20px;
	text-align: center;
}
.tool-button {
	display: inline-block;
	cursor: pointer;

	background-color: #ddd;
	text-align: center;

	margin: 20px;
	margin-top: 0;
	padding: 20px;
	
	width: 200px;
	height: 20px;
	line-height: calc(10px - .5em);

	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
}
.thicknessSlider {
	vertical-align: top;
	margin-top:0px;
	position: relative;
	top: -.5em;
}
</style>
