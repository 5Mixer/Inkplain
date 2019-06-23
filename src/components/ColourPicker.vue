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
				"#333333","#63BBEE", "#92E285", "#ef5656", "#F09E6F", "#DC85E9", "#F5CE53", "#a07b86" 
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
	display: block;
	
	text-align: center;

	vertical-align: top;
	border: solid 1px grey;
	margin: 5px;
	padding: 10px;
}
.colour-swatch {
	display: inline-block;
	cursor: pointer;

	text-align: center;
	vertical-align: top;

	margin: 5px;

	border-radius: 0px;
	border: #0002 solid 2px;
	
	width: 25px;
	height: 25px;
}
</style>
