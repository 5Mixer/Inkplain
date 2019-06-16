import {Recorder} from "@/video/record.js"
import {Renderer} from "@/video/render.js"
import {AudioManager} from "@/video/audio.js"
function AnnotationCanvas (canvas, audioElement, progressElement) {
	this.colours = {
		black: 0,
		white: 1
	}
	this.colourLUT = [ 'black', 'white', "#92E285", "#63BBEE", "#F09E6F", "#DC85E9", "#F5CE53", "#333333"]
	this.brush = { thickness: 2, colour: this.colours.black }
	this.eventTypes = {
		clear: 1,
		down: 2,
		up: 3,
		moving: 4,
		brush: 5
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

	this.recordDrawEvent = function(shouldDraw) {
		if (this.recorder.recording) {
			let record = {type: shouldDraw ? this.eventTypes.down : this.eventTypes.up }
			this.playRecord(record)
			this.recorder.record(record)
		}
	}
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
	}.bind(this));
	
	canvas.addEventListener("pointerdown", function (e) {
		this.recordDrawEvent(true)
	}.bind(this));
	canvas.addEventListener("pointerup", function (e) {
		this.recordDrawEvent(false)
	}.bind(this));
	canvas.addEventListener("mouseout", function (e) {
		this.recordDrawEvent(false)
	}.bind(this));

	// Button / brush handlers
	this.brushColour = function(colIndex){
		this.brush.colour = colIndex
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
		this.recorder.record(JSON.parse(JSON.stringify(record)))
		this.playRecord(record)
	}
	this.brushColourWithLookup = function (colour) {
		this.brushColour(this.colourLUT.indexOf(colour))

	}
	this.brushWidth = function(val){
		this.brush.thickness = val
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
		this.playRecord(record)
		this.recorder.record(record)
	}
	this.clearCanvas = function() {
		let record = {type: this.eventTypes.clear}
		this.playRecord(record)
		this.recorder.record(record)
	}
	this.toolSelect = function (tool) {
		let toolBrush = JSON.parse(JSON.stringify(this.brush))
		if (tool == "eraser") {
			toolBrush.colour = this.colours.white
			toolBrush.thickness = 40
			toolBrush.opacity = 1
		}
		if (tool == "highlighter") {
			toolBrush.opacity = .7
			toolBrush.thickness = 15
		}
		if (tool == "pen") {
			toolBrush.opacity = 1
			toolBrush.colour = this.colours.black
			toolBrush.thickness = 2
		}
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(toolBrush))}
		this.recorder.record(JSON.parse(JSON.stringify(record)))
		this.playRecord(record)
	}

	// Switch recording mode on/off
	this.recToggle = function(){

		this.renderer.clear()
		this.brush = {
			thickness: 2,
			opacity: 1,
			colour: this.colours.black
		}

		if (!this.recorder.recording){
			this.recorder.startRecording()

			if (this.recordAudio)
				this.audioManager.startRecordingAudio()

			this.recorder.record({ type: this.eventTypes.brush, brush: JSON.parse(JSON.stringify(this.brush)) })
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
	this.save = function () {
		let video = {
			title: 'no title',
			lengthTime: this.playback.lengthTime,
			eventData: this.recorder.recordStore
		}
		console.log(video)
		console.log(JSON.stringify(video).length)
	}

	// Draw up to a specific time by recursively running playEventRecursive
	this.renderVideo = function(records, upTo) {
		this.renderer.clear()
		this.playEventRecursive(records,0, upTo)
	}
	this.playEventRecursive = function(records,i,upTo) {
		// Stop recursively replaying events if this event is after where replaying should stop
			
		let parsedRecord = {}
		var offset = 0
		switch (records[i]) {
			case this.eventTypes.moving: {
				parsedRecord.type = this.eventTypes.moving
				parsedRecord.time = records[i + 1]
				parsedRecord.coords = { x: records[i + 2], y: records[i + 3] }
				offset = 4
				break
			}
			case this.eventTypes.clear: {
				parsedRecord.type = this.eventTypes.clear
				parsedRecord.time = records[i + 1]
				offset = 2
				break
			}
			case this.eventTypes.up: {
				parsedRecord.type = this.eventTypes.up
				parsedRecord.time = records[i + 1]
				offset = 2
				break
			}
			case this.eventTypes.down: {
				parsedRecord.type = this.eventTypes.down
				parsedRecord.time = records[i + 1]
				offset = 2
				break
			}
			case this.eventTypes.brush: {
				parsedRecord.type = this.eventTypes.brush
				parsedRecord.time = records[i + 1]

				let recordbrush = {}

				recordbrush.colour = records[i + 2]
				recordbrush.thickness = records[i + 3]
				parsedRecord.brush = JSON.parse(JSON.stringify(recordbrush))
				offset = 4
				break
			}
			default: {
				offset = 1
				break
			}
		}


		if (parsedRecord.time > upTo)
			return

		this.playRecord(parsedRecord)

		if (i < records.length - 2){
			this.playEventRecursive(records,i + offset, upTo)
		}
	}.bind(this)
	this.playRecord = function(record) {
		if (record.type == this.eventTypes.moving){
			// set previous coords based on current, and load current from event
			this.renderer.previousPos.x = this.renderer.currentPos.x
			this.renderer.previousPos.y = this.renderer.currentPos.y
			this.renderer.currentPos.x = record.coords.x
			this.renderer.currentPos.y = record.coords.y
			// If this move event occurs right after the pen has just been pushed down, move prev point to current.
			if (this.renderer.startedDrawing){
				// unset flag
				this.renderer.startedDrawing = false
				this.renderer.previousPos.x = this.renderer.currentPos.x
				this.renderer.previousPos.y = this.renderer.currentPos.y
			}
			// A move event may or may not occur with the pen down (ie. mouse may be moving, but not drawing)
			if (this.renderer.down)
				this.renderer.draw()
		}
		if (record.type == this.eventTypes.down){
			// flag = true
			this.renderer.down = true
			this.renderer.startedDrawing = true
		}
		if (record.type == this.eventTypes.up) {
			this.renderer.down = false
		}
		if (record.type == this.eventTypes.brush){
			this.renderer.brush = record.brush
			this.renderer.brush.colour = this.colourLUT[record.brush.colour]
		}
		if (record.type == this.eventTypes.clear){
			this.renderer.clear()
		}
	}

	this.drawframe = function() {
		if (this.recorder.recording){
			this.playback.time = 0
		}else{
			this.renderer.clear()
			if (this.recorder.recordStore.length != 0){
				this.renderVideo(this.recorder.recordStore, this.playback.time) //audioElement.currentTime * 1000)
				this.renderer.drawPointer()
			}
			if (this.playback.playing && this.playback.time < this.playback.lengthTime)
				this.playback.time += 1000/120
			if (this.playback.time >= this.playback.lengthTime) {
				this.playback.time = this.playback.lengthTime
				this.playback.playing == false
			}

			this.playback.progress = this.playback.time / this.playback.lengthTime
			progressElement.style.width = this.playback.progress * 100 + "%"
		}
		// requestAnimationFrame(this.drawframe)
	}.bind(this)
	// this.drawframe()
	setInterval(this.drawframe, 1000/120)
	return this
}
export { AnnotationCanvas }
