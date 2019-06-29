<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Annotati</router-link>
			<router-link to="/about">About</router-link> 
			<router-link to="/rec">Record</router-link> 
			<router-link to="/play">Videos</router-link>
		</div>
		<router-view/>
	</div>
</template>

<style lang="scss">
a {
    color: #222;
    text-decoration: none;
    background: linear-gradient(to top, #ff7f7f66 5%, transparent 5%);
    display:inline-block;
	font-weight: 400;
	font-family: 'Heebo', serif; 
	padding: .2em;
	margin: .3em;
}
a:hover {
    background: linear-gradient(to top,  #ff7f7f66 50%, transparent 50%);
}

html {
	box-sizing: border-box;
}
body, h1, h2, h3, h4, h5, h6, p, ol, ul, textarea {
	padding: 0;
	color: #111;
	font-family: 'Heebo', serif; 
	line-height: 1.6em;
	font-size: 1.1em;
}
input,textarea {
	margin: 5px;
	padding: 20px;
	
	line-height: calc(10px - .5em);

	font-size: 1em;
	line-height: 1.4em;
	border: 1px solid gray;
}
body {
	margin: 2em;
}
h1 {
	font-size: 2em; 
	/*font-family: 'Patua One', serif; */
	font-weight: 400;
	color: #101010
}
img {
	max-width: 100%;
	height: auto;
}
.unselectable {
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
}

*, *:before, *:after {
	box-sizing: inherit;
}
ol, ul {
	list-style: none;
}
.button {
	display: inline-block;
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
}

</style>
