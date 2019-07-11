<template>
	<div class="home">
		<div class="hero">
			<div class="form">
				<h2>Login to Annotati</h2>
				<table>
					<tr>
						<td>
							<label for="email">Email:</label>
						</td>
						<td>
							<input type="email" placeholder="Enter email address" id="email" v-model="email" v-on:input="errorMessage=''">
						</td>
					</tr>
					<tr>
						<td>
							<label for="password">Password:</label>
						</td>
						<td>
							<input type="password" placeholder="Enter password" id="password" v-model="password">
						</td>
					</tr>
				</table>
				<div class="error" v-if="errorMessage != ''">{{ errorMessage }}</div>
				<br>
				<div class="register button" @click="login()">Login to Annotati</div>
			</div>
			
			<div>
				<h2>
					Need an account?
				</h2>
				<div class="button" @click="signup()">Sign up</div>
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
			this.$router.push({ name: 'home' })
		},
		login: function () {
			var form = { email: this.email, password: this.password }
			
			if (this.email == "" || this.password == "") {
				this.errorMessage = "Please complete the form."
				return
			}

			axios.post('http://localhost:3000/login', form, { withCredentials: true}).then(function (response){
				if (response.data.success) {
					this.$router.push({ name: "about" })
				} else {
					this.errorMessage = "Failed to login."
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
