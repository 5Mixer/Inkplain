import { Recorder } from "@/video/record.js"
import { Renderer } from "@/video/render.js"
import { AudioManager } from "@/video/audio.js"
const axios = require('axios')

function AnnotationCanvas (canvas, audioElement, progressElement) {
	this.colours = {
		black: 0,
		white: 1
	}
	this.colourLUT = [ 'black', 'white', "#333333","#63BBEE", "#92E285", "#ef5656", "#F09E6F", "#DC85E9", "#F5CE53", "#a07b86" ]

	this.brush = { thickness: 2, colour: this.colours.black, opacity: 1 }
	this.storedInkColour = this.colours.black // Store ink colour for instance between uses of the eraser
	this.inCanvas = false
	this.eventTypes = {
		clear: 1,
		down: 2,
		up: 3,
		moving: 4,
		brush: 5,
		enter: 6,
		leave: 7
	}
	this.playback = {
		time: 0,
		lengthTime: 0,
		progress: 0, 
		playing: false
	}
	this.recordAudio = false

	this.recorder = new Recorder()
	this.renderer = new Renderer(canvas)
	this.audioManager = new AudioManager(audioElement)
	this.canvas = this.renderer.canvas

	// Register event handlers
	canvas.addEventListener("pointermove", function(e) {
		if (!this.recorder.recording) return

		const rect = canvas.getBoundingClientRect()
		const events = e.getCoalescedEvents();
		events.forEach((e) => {
			let record = {type:this.eventTypes.moving,coords:{x:Math.round((e.clientX - rect.left)/canvas.clientWidth*1920), y: Math.round((e.clientY - rect.top)/canvas.clientHeight*1080)}}
			this.recorder.record(record)
			this.playRecord(record)
		})
		e.preventDefault()
	}.bind(this));

	canvas.addEventListener("touchmove", function (e) {
		if (!this.recorder.recording) return

		const rect = canvas.getBoundingClientRect()
		// let record = {type:this.eventTypes.moving,coords:{x:Math.round((e.clientX - rect.left)/canvas.clientWidth*1920), y: Math.round((e.clientY - rect.top)/canvas.clientHeight*1080)}}
		let record = {type:this.eventTypes.moving,coords:{x:Math.round((e.targetTouches[0].clientX - rect.left)/canvas.clientWidth*1920), y: Math.round((e.targetTouches[0].clientY - rect.top)/canvas.clientHeight*1080)}}
		this.recorder.record(record)
		this.playRecord(record)

		e.preventDefault()
	}.bind(this))
	canvas.addEventListener("touchstart", function (e) {
		let record1 = { type: this.eventTypes.down }
		this.playRecord(record1)
		this.recorder.record(record1)
		e.preventDefault()
	}.bind(this))
	canvas.addEventListener("touchend", function (e) {
		let record = { type: this.eventTypes.up }
		this.playRecord(record)
		this.recorder.record(record)
		e.preventDefault()
	}.bind(this));
	canvas.addEventListener("touchcancel", function (e) {
		let record = { type: this.eventTypes.up }
		this.playRecord(record)
		this.recorder.record(record)
		e.preventDefault()
	}.bind(this));

	canvas.addEventListener("pointerdown", function (e) {
		let record1 = { type: this.eventTypes.down }
		this.playRecord(record1)
		this.recorder.record(record1)

		const rect = canvas.getBoundingClientRect()
		
		let record = {type:this.eventTypes.moving,coords:{x:Math.round((e.clientX - rect.left)/canvas.clientWidth*1920), y: Math.round((e.clientY - rect.top)/canvas.clientHeight*1080)}}
		this.recorder.record(record)
		this.playRecord(record)
		e.preventDefault()
	}.bind(this));
	canvas.addEventListener("pointerup", function (e) {
		let record = { type: this.eventTypes.up }
		this.playRecord(record)
		this.recorder.record(record)
		e.preventDefault()
	}.bind(this));
	canvas.addEventListener("mouseout", function (e) {
		let record = { type: this.eventTypes.up }
		this.playRecord(record)
		this.recorder.record(record)
		
		this.recorder.record({ type: this.eventTypes.leave})
		e.preventDefault()
	}.bind(this));
	canvas.addEventListener("mouseenter", function (e) {
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
		this.playRecord(record)
		this.recorder.record(record)
		
		this.recorder.record({ type: this.eventTypes.enter})
		e.preventDefault()
	}.bind(this));

	// Button / brush handlers
	this.brushColour = function(colIndex){
		this.brush.colour = colIndex
		this.storedInkColour = this.brush.colour
	}
	this.brushColourWithLookup = function (colour) {
		this.brushColour(this.colourLUT.indexOf(colour))
	}
	this.brushWidth = function(val){
		this.brush.thickness = val
	}
	this.clearCanvas = function() {
		let record = {type: this.eventTypes.clear}
		this.playRecord(record)
		this.recorder.record(record)
	}
	this.toolSelect = function (tool) {
		// let toolBrush = JSON.parse(JSON.stringify(this.brush))
		if (tool == "eraser") {
			this.storedInkColour = this.brush.colour
			this.brush.colour = this.colours.white
			this.brush.thickness = 40
			// toolBrush.thickness = 40
			this.brush.opacity = 1
		}
		if (tool == "highlighter") {
			this.brush.colour = this.storedInkColour
			this.brush.thickness = 15
			this.brush.opacity = .4
			// toolBrush.thickness = 15
		}
		if (tool == "pen") {
			this.brush.colour = this.storedInkColour
			this.brush.thickness = 2
			this.brush.opacity = 1
			// toolBrush.colour = this.brush.colour //this.colours.black
			// toolBrush.thickness = 2
		}
		// let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(toolBrush))}
		// this.recorder.record(JSON.parse(JSON.stringify(record)))
		// this.playRecord(record)
	}

	this.takeSnap = function () {
		var newCanvas = document.createElement('canvas');
		var context = newCanvas.getContext('2d');

		newCanvas.width = canvas.width;
		newCanvas.height = canvas.height;

		context.drawImage(canvas, 0, 0);
	}

	// Switch recording mode on/off
	this.recToggle = function(){


		if (!this.recorder.recording){
			this.renderer.clear()
			this.recorder.startRecording()
			this.storedInkColour = this.brush.colour

			if (this.recordAudio)
				this.audioManager.startRecordingAudio()

			// this.recorder.record({ type: this.eventTypes.brush, brush: JSON.parse(JSON.stringify(this.brush)) })
			let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
			this.recorder.record(JSON.parse(JSON.stringify(record)))
			this.playRecord(record)
		}else{
			this.playback.lengthTime = this.recorder.recordingLength
			this.audioManager.stopRecordingAudio()
			this.recorder.stopRecording()
		}
	}
	this.micToggle = function(){
		this.recordAudio = !this.recordAudio
		if (this.recordAudio)
			this.audioManager.activateAudio()
	}
	this.playToggle = function () {
		this.playback.playing = !this.playback.playing
		if (this.playback.playing && this.playback.progress == 1)
			this.playback.time = 0
	}
	this.setPlayProgress = function (progress) {
		this.playback.time = this.playback.lengthTime * progress
	}
	this.save = function (title, description) {
		let video = {
			title: title,
			description: description,
			lengthTime: this.playback.lengthTime,
			eventData: this.recorder.recordStore
		}
		this.exportVideo(video)
	}
	this.exportVideo = new function (video) {}

	this.load = function (data) {
		this.recorder.recordStore = (data.eventData)
		this.playback.lengthTime = data.lengthTime
		this.recorder.recordingLength = data.lengthTime
		this.playback.time = 0
		this.recorder.recording = false
	}

	// Draw up to a specific time by recursively running playEventRecursive
	this.renderVideo = function(records, upTo) {
		this.renderer.clear()
		this.playEventRecursive(records,0, upTo)

		// Finish any open pen strokes
		if (this.renderer.down)
			this.renderer.penUp()
	}
	
	let offset = 0
	this.playEventRecursive = function(records,i,upTo) {

		switch (records[i]) {
			case this.eventTypes.moving: {
				offset = 4
				this.renderer.move(records[i + 2], records[i + 3])
				break
			}
			case this.eventTypes.clear: {
				this.renderer.clear()
				offset = 2
				break
			}
			case this.eventTypes.up: {
				offset = 2
				this.renderer.penUp()
				break
			}
			case this.eventTypes.down: {
				offset = 2
				this.renderer.penDown()
				break
			}
			case this.eventTypes.brush: {
				let recordbrush = {}
				recordbrush.colour = records[i + 2]
				recordbrush.thickness = records[i + 3]
				recordbrush.opacity = records[i + 4]
				this.renderer.brush = JSON.parse(JSON.stringify(recordbrush))
				this.renderer.brush.colour = this.colourLUT[recordbrush.colour]
				this.renderer.brushLoad()
				// parsedRecord.brush = JSON.parse(JSON.stringify(recordbrush))
				offset = 5
				// this.playRecord(parsedRecord)
				break
			}
			case this.eventTypes.enter: {
				this.renderer.penEnter()
				offset = 2;
				break;
			}
			case this.eventTypes.leave: {
				this.renderer.penLeave()
				offset = 2;
				break;
			}
			default: {
				offset = 1
				break
			}
		}
		
		// Play the next event
		if (i < records.length - 2 && records[i + 1] < upTo){
			this.playEventRecursive(records,i + offset, upTo)
		}
	}.bind(this)
	this.playRecord = function(record) {
		if (record.type == this.eventTypes.moving){
			this.renderer.move(record.coords.x, record.coords.y)

			// While in recording mode, operations must be drawn as they are applied, as it works by
			// not clearing on a frame by frame basis. As such, draw should be could to draw a line in rec. mode.
			if (this.renderer.down && this.recorder.recording)
				this.renderer.draw()
		}
		if (record.type == this.eventTypes.down){
			this.renderer.penDown()
		}
		if (record.type == this.eventTypes.up) {
			this.renderer.penUp()
		}
		if (record.type == this.eventTypes.brush){
			this.renderer.brush = JSON.parse(JSON.stringify(record.brush))
			this.renderer.brush.colour = this.colourLUT[record.brush.colour]
			this.renderer.brushLoad()
		}
		if (record.type == this.eventTypes.clear){
			this.renderer.clear()
		}
	}
	
	var lastTime = Date.now()
	this.drawframe = function() {
		let delta = Date.now() - lastTime
		lastTime = Date.now()

		if (this.recorder.recording){
			this.playback.time = 0
		}else{
			this.renderer.clear()
			if (this.recorder.recordStore.length != 0){
				this.renderVideo(this.recorder.recordStore, this.playback.time) //audioElement.currentTime * 1000)
				this.renderer.drawPointer()
			}
			if (this.playback.playing && this.playback.time < this.playback.lengthTime)
				this.playback.time += delta
			if (this.playback.time >= this.playback.lengthTime) {
				this.playback.time = this.playback.lengthTime
				this.playback.playing == false
			}

			this.playback.progress = this.playback.time / this.playback.lengthTime
			progressElement.style.width = this.playback.progress * 100 + "%"
		}
		requestAnimationFrame(this.drawframe)
	}.bind(this)
	this.drawframe()
	return this
}
export { AnnotationCanvas }
