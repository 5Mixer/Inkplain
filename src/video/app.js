import {Recorder} from "@/video/record.js"
import {Renderer} from "@/video/render.js"
import {AudioManager} from "@/video/audio.js"
function AnnotationCanvas (canvas, audioElement, progressElement) {
	this.brush = { thickness: 1, colour: "black" }
	this.eventTypes = {
		drawing: 1,
		moving: 2,
		brush: 3,
		clear: 4
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
			let record = {type:this.eventTypes.drawing, isDrawing: shouldDraw }
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
			let record = {type:this.eventTypes.move,coords:{x:Math.round((e.clientX - rect.left)/canvas.clientWidth*1920), y: Math.round((e.clientY - rect.top)/canvas.clientHeight*1080)}}
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
	this.brushColour = function(col){
		this.brush.colour = col
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
		this.playRecord(record)
		this.recorder.record(record)
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
		if (tool == "eraser") {
			this.brush.colour = "white"
			this.brush.thickness = 20
		}
		if (tool == "highlighter") {
			this.brush.opacity = .7
		}
		if (tool == "pen") {
			this.brush.opacity = 1
		}
		let record = {type:this.eventTypes.brush,brush:JSON.parse(JSON.stringify(this.brush))}
		this.playRecord(record)
		this.recorder.record(record)
	}

	// Switch recording mode on/off
	this.recToggle = function(){

		this.renderer.clear()
		this.brush = {
			thickness: 2,
			colour: "black"
		}

		if (!this.recorder.recording){
			this.recorder.startRecording()

			if (this.recordAudio)
				this.audioManager.startRecordingAudio()

			this.recorder.record({ type: this.eventTypes.brush, brush: JSON.parse(JSON.stringify(this.brush)) })
		}else{
			this.audioManager.stopRecordingAudio()
			this.recorder.stopRecording()
			this.playback.lengthTime = this.recorder.recordingLength
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

	// Draw up to a specific time by recursively running playEventRecursive
	this.playback = function(records, upTo) {
		this.renderer.clear()
		this.playEventRecursive(records,0, upTo)
	}
	this.playEventRecursive = function(records,i,upTo) {
		// Stop recursively replaying events if this event is after where replaying should stop
		if (records[i].time > upTo)
			return

		this.playRecord(records[i])

		if (i < records.length - 2){
			this.playEventRecursive(records,i+1, upTo)
		}
	}.bind(this)
	this.playRecord = function(record) {
		if (record.type == this.eventTypes.move){
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
		if (record.type == this.eventTypes.drawing){
			// flag = true
			this.renderer.down = record.isDrawing
			if (this.renderer.down)
				this.renderer.startedDrawing = true
		}
		if (record.type == this.eventTypes.brush){
			this.renderer.brush = record.brush
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
				this.playback(this.recorder.recordStore, this.playback.time) //audioElement.currentTime * 1000)
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
