const mongoose = require("mongoose")
const nanoid = require("nanoid")

var VideoSchema = new mongoose.Schema({
	uploadDate: {
		type: Date,
		default: Date.now
	},
	id: {
		type: String,
		default: () => { return nanoid(8) }
	},
	title: String,
	description: String,
	uploader: String,
	lengthTime: Number,
	eventData: [Number]
})

const Video = mongoose.model('Video', VideoSchema)

module.exports = Video
