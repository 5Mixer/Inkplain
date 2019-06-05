import {Recorder} from "@/video/record.js"
import {Renderer} from "@/video/render.js"
function AnnotationCanvas (canvas) {
	this.brush = { thickness: 1, color: "black" }
	this.eventTypes = {
		drawing: 1,
		moving: 2,
		brush: 3,
		clear: 4
	}

	this.recorder = new Recorder()
	this.renderer = new Renderer(canvas)
	this.canvas = this.renderer.canvas

	// Register event handlers
	canvas.addEventListener("pointermove", this.move);
	canvas.addEventListener("pointerdown", function (e) {
		this.recordDrawEvent(true)
	});
	canvas.addEventListener("pointerup", function (e) {
		this.recordDrawEvent(false)
	});
	canvas.addEventListener("mouseout", function (e) {
		this.recordDrawEvent(false)
	});
	this.recordDrawEvent = function(shouldDraw) {
		if (recorder.recording) {
			let record = {type:eventTypes.drawing, isDrawing: shouldDraw }
			this.playRecord(record)
			this.recorder.record(record)
		}
	}

	// Button / brush handlers
	this.brushColour  = function(col){
		brush.color = col
		let record = {type:eventTypes.brush,brush:JSON.parse(JSON.stringify(brush))}
		playRecord(record)
		recorder.record(record)
	}
	this.brushWidth  = function(val){
		brush.thickness = val
		let record = {type:eventTypes.brush,brush:JSON.parse(JSON.stringify(brush))}
		playRecord(record)
		recorder.record(record)
	}
	this.clearCanvas  = function() {
		let record = {type: eventTypes.clear}
		playRecord(record)
		recorder.record(record)
	}


	// Switch recording mode on/off
	this.recToggle = function(){
		console.log("REC TOGGLE")
		this.recorder.recording = !this.recorder.recording
		// document.getElementById('recBtn').innerText = recorder.recording ? "stop" : "rec"

		this.renderer.clear()
		frameShowsUpToEvent = 0
		brush = {
			thickness: 2,
			color: "black"
		}

		if (this.recorder.recording){
			this.recorder.startRecording()
			startRecordingAudio()

			this.recorder.record({ type: eventTypes.brush, brush: JSON.parse(JSON.stringify(brush)) })
		}else{
			stopRecordingAudio()
		}
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
			playEventRecursive(records,i+1, upTo)
		}
	}
	this.playRecord = function(record) {
		if (record.type == eventTypes.move){
			// set previous coords based on current, and load current from event
			this.renderer.previousPos.x = renderer.currentPos.x
			this.renderer.previousPos.y = renderer.currentPos.y
			this.renderer.currentPos.x = record.coords.x
			this.renderer.currentPos.y = record.coords.y
			// If this move event occurs right after the pen has just been pushed down, move prev point to current.
			if (this.renderer.startedDrawing){
				// unset flag
				this.renderer.startedDrawing = false
				this.renderer.previousPos.x = renderer.currentPos.x
				this.renderer.previousPos.y = renderer.currentPos.y
			}
			// A move event may or may not occur with the pen down (ie. mouse may be moving, but not drawing)
			if (this.renderer.down)
				this.renderer.draw()
		}
		if (record.type == eventTypes.drawing){
			flag = true
			this.renderer.down = record.isDrawing
			if (this.renderer.down)
				this.renderer.startedDrawing = true
		}
		if (record.type == eventTypes.brush){
			this.renderer.brush = record.brush
		}
		if (record.type == eventTypes.clear){
			this.renderer.clear()
		}
	}

	// is a record of coords required?
	//flag = false
	this.drawframe  = function() {

		if (this.recorder.recording){
			// renderer.clear()
			if (flag){
				flag = false
				// document.getElementById('fileSize').innerText = Math.round(JSON.stringify(recorder.recordStore).length/100)/10 + " KB" + recorder.recordStore.length
			}
		}else{
			this.renderer.clear()
			if (this.recorder.recordStore.length != 0){
				playback(this.recorder.recordStore, recordedAudio.currentTime * 1000)
				this.renderer.drawPointer()
			}
		}
		requestAnimationFrame(drawframe)
	}
	// drawframe()
	// setInterval(drawframe, 1000/120)
	this.move = function(e) {
		if (!this.recorder.recording) return

		const rect = canvas.getBoundingClientRect()
		const events = e.getCoalescedEvents();
		events.forEach((e) => {
			let record = {type:eventTypes.move,coords:{x:Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top)}}
			this.recorder.record(record)
			playRecord(record)
		})
	}
	return this
}
export { AnnotationCanvas }
