<template>
	<div class="palette">
		<span v-for="colour in colours" v-bind:style="{ backgroundColor: colour }" class="colour-swatch" @click="colourPick(colour)"></span>
	</div>
</template>

<script>
export default {
	name: 'colour-picker',
	data: function () {
		return {
			colours: [
				"#92E285", "#63BBEE", "#F09E6F", "#DC85E9", "#F5CE53", "#333333"
			]
		}
	},
	methods: {
		"colourPick": function (colour) {
			this.$emit("colourPick", colour)
		}
	}
}
</script>

<style scoped lang="scss">
.palette {
	display: inline-block;
	border-radius: 3px;
	
	background-color: #ddd;
	text-align: center;

	margin: 20px;
	margin-top: 0;
	margin-bottom: 5px;
	padding: 20px;
	vertical-align: top;
	
	width: 200px;
	height: 20px;
}
.colour-swatch {
	display: inline-block;
	cursor: pointer;

	text-align: center;
	vertical-align: top;

	position: relative;
	top: -13px;

	margin: 3px;

	border-radius: 4px;
	border: #0002 solid 2px;
	
	width: 20px;
	height: 20px;
}
</style>
