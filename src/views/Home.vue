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

			<div class="form">
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
				<div class="register button" @click="signup()">Create account</div>
			</div>
			
			<div>
				<h2>
					Have an account?
				</h2>
				<div class="button" @click="login()">Login</div>
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
		},
		login: function () {
			this.$router.push({ name: 'login' })
		}
	}
}
</script>
<style>
.hero {
	width: 100%;
	padding: 5em;
	padding-top: 0em;
}
.hero h1 {
	font-size: 3em;
	margin-top: 0em;
	margin-bottom: .5em;
}
.basicInfo {
	max-width: 35em;
}
.button {
	display: inline-block;
	border: none;
	border-radius: 3px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
label {
	float:right;
}
.register {
	padding: 1.2em;
	font-size: 1em;
	font-weight: bold;
	width: 350px;
	background: #6aeb6c;
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
