const mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	id: {
		type: String,
		default: () => { return nanoid(8) }
	}
})

const User = mongoose.model('User', UserSchema)

module.exports = User
