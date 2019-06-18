const express = require('express')
const app = express()
const port = 3000

var videos = {}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/video/:id', (req, res) => {
	if (videos[req.params.id] != undefined) {
		res.send(videos[req.params.id])
	} else {
		res.send("no video there")
	}
})
app.post('/video/', function (req, res) {
	// bit of a strange id generation algorithm
	var id = ((1111111+Math.floor(Math.random() * 8888888))+"").split("").map(a => { return 'bcdghnjkxyz'.split("")[a]}).join("")
	console.log("video pushed "+id)

	videos[id] = req.body
	console.log(videos)
	res.send('id: '+id)
})

app.listen(port, () => console.log(`Server listening on port ${port}`))
