<template>
	<div class="home">
		<div class="hero">
			<h1>
				Create annotation videos online 
			</h1>

			<img src="@/assets/screenOptimised.png" alt="" title="Screenshot of Annotati" width="600">
			
			<p class="basicInfo">
				Use your stylus to write on top of questions, a blank canvas, or documents.
				When you are finished, click publish and share your video link.
			</p>

			<div>
				<h2>Sign up for free</h2>
				<table>
					<tr>
						<td>
							<label for="email">Email:</label>
						</td>
						<td>
							<input type="email" placeholder="Enter your email address" id="email">
						</td>
					</tr>
					<tr>
						<td>
							<label for="password">Password:</label>
						</td>
						<td>
							<input type="password" placeholder="Set a password" id="password">
						</td>
					</tr>
				</table>
				<br>
				<div class="register button">Sign up</div>
			</div>
			

		</div>
	</div>
</template>

<script>
</script>
<style>
.hero {
	width: 100%;
	padding: 5em;
	padding-top: 2em;
}
.hero > h1 {
	font-size: 3em;
}
.basicInfo {
	max-width: 35em;
}
.button {
	display: inline-block;
}
label {
	float:right;
}
.register {
	padding: 1.3em;
	font-size: 1.3em;
	font-weight: bold;
}
img {
	float: right;
	margin: 1em;
}
</style>
