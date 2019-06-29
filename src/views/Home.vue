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
							<input type="email" placeholder="Enter your email address" id="email" v-model="email" v-on:input="errorMessage=''">
						</td>
					</tr>
					<tr>
						<td>
							<label for="password">Password:</label>
						</td>
						<td>
							<input type="password" placeholder="Set a password" id="password" v-model="password">
						</td>
					</tr>
				</table>
				<div class="error" v-if="errorMessage != ''">{{ errorMessage }}</div>
				<br>
				<div class="register button" @click="signup()">Sign up</div>
			</div>
			

		</div>
	</div>
</template>

<script>
const axios = require('axios')

export default {
	name: 'home',
	data: function () {
		return {
			email: "",
			password: "",
			errorMessage: ""
		}
	},
	methods: {
		signup: function () {
			var form = { email: this.email, password: this.password }
			
			if (this.email == "" || this.password == "") {
				this.errorMessage = "Please complete the form."
				return
			}
			if (this.password.length < 6) {
				this.errorMessage = "Please choose a longer password."
				return
			}

			axios.post('http://localhost:3000/user', form).then(function (response){
				if (response.data.success) {
					this.$router.push({ name: "playback" })
				} else {
					this.errorMessage = "That email already has an account."
				}
			}.bind(this))
			
		}
	}
}
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
.error {
	background: #ed3939;
	display: inline-block;
	margin: 1em;
	padding: .5em;

}
</style>
