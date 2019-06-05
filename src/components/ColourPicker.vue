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
	padding: 20px;
	vertical-align: top;
	
	width: 680px;
	height: 70px;
}
.colour-swatch {
	display: inline-block;
	cursor: pointer;

	text-align: center;
	vertical-align: top;

	margin: 2px;
	padding: 5px;

	border-radius: 10px;
	border: #0002 solid 2px;
	
	width: 30px;
	height: 30px;
	line-height: calc(10px - .5em);
}
</style>
