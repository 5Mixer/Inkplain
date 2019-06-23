<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link>
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
body, h1, h2, h3, h4, h5, h6, p, ol, ul {
	margin: 0;
	margin-left: 10px;
	padding: 0;
	color: #111;
	font-family: 'Heebo', serif; 
	line-height: 1.6em;
	font-size: 1.1em;
}
/*h1 { font-size: 2.6rem; font-family: 'Patua One', serif; font-weight: 400; color: #101010}*/
img {
	max-width: 100%;
	height: auto;
}

*, *:before, *:after {
	box-sizing: inherit;
}
ol, ul {
	list-style: none;
}

</style>
