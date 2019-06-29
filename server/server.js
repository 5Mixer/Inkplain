const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/annotate', { useNewUrlParser: true })

const User = require("./models/User")
const Video = require("./models/Video")

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/video/:id', (req, res) => {
	Video.findOne({ id: req.params.id }, function (err, video) {
		if (!err) {
			res.json(video)
		} else {
			console.log (err)
			res.send(501)
		}
	})
})
app.get('/listing/', (req, res) => {
	Video.find({}).select("title uploadDate").then(function (videos){
		res.json(videos)
	}, function (err) {
		console.log(err)
		res.send(501)
	})
})
app.post('/video/', function (req, res) {
	var video = new Video({
		title: req.body.title,
		description: req.body.description,
		lengthTime: req.body.lengthTime,
		uploader: "INCOMPLETE",
		eventData: req.body.eventData
	})
	video.save()
	console.log(video)
	res.send({ success: true, id: video.id})
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
