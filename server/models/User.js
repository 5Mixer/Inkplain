const mongoose = require("mongoose")
const nanoid = require("nanoid")
const bcrypt = require("bcryptjs")

var UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	id: {
		type: String,
		default: () => { return nanoid(8) }
	}
})

UserSchema.pre('save', function (next) {
	if (!this.isModified('password'))
		return next()

	if (this.password) {
		this.password = bcrypt.hashSync(this.password, 11)
		next()
	}
})

UserSchema.methods.comparePassword = function (plaintext, callback) {
	return bcrypt.compareSync(plaintext, this.password)
}

const User = mongoose.model('User', UserSchema)

module.exports = User
