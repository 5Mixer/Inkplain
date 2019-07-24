const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const auth = require('./auth')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/annotate', { useNewUrlParser: true })

const User = require("./models/User")
const Video = require("./models/Video")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: ['http://localhost:8080','http://inkplain.com','https://inkplain.com']}))

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'nwiobxrf3oif7bnwe',
	unset: 'destroy',
	// name: 'sessionstore',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		httpOnly: false, secure: false
	}
}));

app.get('api/video/:id', (req, res) => {
	Video.findOne({ id: req.params.id }, function (err, video) {
		if (!err) {
			console.log(video)
			res.json(video)
		} else {
			console.log (err)
			res.send(501)
		}
	})
})
app.get('api/listing/', (req, res) => {
	Video.find({}).select("title uploadDate id").then(function (videos){
		res.json(videos)
	}, function (err) {
		console.log(err)
		res.send(501)
	})
})
app.get('api/userlisting/', auth.checkAuthentication, (req, res) => {
	Video.find({ uploader: req.session.userId }).select("title uploadDate id").then(function (videos){
		res.json(videos)
	}, function (err) {
		console.log(err)
		res.send(501)
	})
})
app.post('api/deletevideo/', auth.checkAuthentication, function (req, res) {
	Video.deleteOne({ uploader: req.session.userId, id: req.body.id }).then(function (result){
		if (result.ok) {
			res.send({ success: true })
		} else {
			res.send({ success: false })
		}
	})
})
app.post('api/video/', auth.checkAuthentication, function (req, res) {
	if (req.body.eventData == undefined || req.body.eventData.length < 2) {
		res.send({ success: false, error: "Lacking event data"})
		return
	}
	var video = new Video({
		title: req.body.title,
		description: req.body.description,
		lengthTime: req.body.lengthTime,
		uploader: req.session.userId,
		eventData: req.body.eventData
	})
	video.save()
	res.send({ success: true, id: video.id})
})
app.get('api/user/', auth.checkAuthentication, function (req, res) {
	if (req.session.userId) {
		User.findOne({id: req.session.userId }, async function (err, user) {
			if (err) {
				res.json({success: false})
			} else {
				res.json(user)
			}
		})
	} else {
		res.json({ success: false })
	}
})

app.post('api/user/', async function (req, res) {
	User.find({ email: req.body.email }, async function (err, docs) {
		if (docs.length > 0) {
			res.send({ success: false, error: "Email taken" })
			return
		} else {
			var user = new User({
				email: req.body.email,
				password: req.body.password
			})
			user.save(function (err) {
				console.log(err)
				req.session.userId = user.id
				res.send({ success: true })
			})
		}
	})
})
app.get('api/logout/', function (req, res) {
	req.session.destroy()
	res.send({ success : true })
})
app.post('api/login/', async function (req, res) {
	User.findOne({ email: req.body.email }, async function (err, user) {
		if (user != undefined) {
			if (user.comparePassword(req.body.password)) {
				if (req.session.userId){
					req.session.userId = user.id
				} else {
					req.session.userId = user.id
				}
				res.send({success:true, user: { id: user.id }})
			} else {
				// Password didn't match
				res.json({success: false})
			}
		} else {
			// No user found
			res.json({success: false})
		}
	})
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
