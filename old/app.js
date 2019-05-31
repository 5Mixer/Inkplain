var brush = {
	thickness: 1,
	color: "black"
}
var eventTypes = {
	drawing: 1,
	moving: 2,
	brush: 3,
	clear: 4
}

var recorder = new Recorder()
var renderer = new Renderer()
var canvas = renderer.canvas

// Register event handlers
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerdown", function (e) {
	recordDrawEvent(true)
});
canvas.addEventListener("pointerup", function (e) {
	recordDrawEvent(false)
});
canvas.addEventListener("mouseout", function (e) {
	recordDrawEvent(false)
});
function recordDrawEvent(shouldDraw) {
	if (recorder.recording) {
		let record = {type:eventTypes.drawing, isDrawing: shouldDraw }
		playRecord(record)
		recorder.record(record)
	}
}

// Button / brush handlers
function brushColour (col){
	brush.color = col
	let record = {type:eventTypes.brush,brush:JSON.parse(JSON.stringify(brush))}
	playRecord(record)
	recorder.record(record)
}
function brushWidth (val){
	brush.thickness = val
	let record = {type:eventTypes.brush,brush:JSON.parse(JSON.stringify(brush))}
	playRecord(record)
	recorder.record(record)
}
function clearCanvas () {
	let record = {type: eventTypes.clear}
	playRecord(record)
	recorder.record(record)
}


// Switch recording mode on/off
function recToggle(){
	recorder.recording = !recorder.recording
	document.getElementById('recBtn').innerText = recorder.recording ? "stop" : "rec"

	renderer.clear()
	frameShowsUpToEvent = 0
	brush = {
		thickness: 2,
		color: "black"
	}

	if (recorder.recording){
		recorder.startRecording()
		startRecordingAudio()

		recorder.record({ type: eventTypes.brush, brush: JSON.parse(JSON.stringify(brush)) })
	}else{
		stopRecordingAudio()
	}
}

// Draw up to a specific time by recursively running playEventRecursive
function playback(records, upTo) {
	renderer.clear()
	playEventRecursive(records,0, upTo)
}
function playEventRecursive(records,i,upTo) {
	// Stop recursively replaying events if this event is after where replaying should stop
	if (records[i].time > upTo)
		return

	playRecord(records[i])

	if (i < records.length - 2){
		playEventRecursive(records,i+1, upTo)
	}
}
function playRecord(record) {
	if (record.type == eventTypes.move){
		// set previous coords based on current, and load current from event
		renderer.previousPos.x = renderer.currentPos.x
		renderer.previousPos.y = renderer.currentPos.y
		renderer.currentPos.x = record.coords.x
		renderer.currentPos.y = record.coords.y
		// If this move event occurs right after the pen has just been pushed down, move prev point to current.
		if (renderer.startedDrawing){
			// unset flag
			renderer.startedDrawing = false
			renderer.previousPos.x = renderer.currentPos.x
			renderer.previousPos.y = renderer.currentPos.y
		}
		// A move event may or may not occur with the pen down (ie. mouse may be moving, but not drawing)
		if (renderer.down)
			renderer.draw()
	}
	if (record.type == eventTypes.drawing){
		flag = true
		renderer.down = record.isDrawing
		if (renderer.down)
			renderer.startedDrawing = true
	}
	if (record.type == eventTypes.brush){
		renderer.brush = record.brush
	}
	if (record.type == eventTypes.clear){
		renderer.clear()
	}
}

// is a record of coords required?
flag = false
drawframe = function() {

	if (recorder.recording){
		// renderer.clear()
		if (flag){
			flag = false
			document.getElementById('fileSize').innerText = Math.round(JSON.stringify(recorder.recordStore).length/100)/10 + " KB" + recorder.recordStore.length
		}
	}else{
		renderer.clear()
		if (recorder.recordStore.length != 0){
			playback(recorder.recordStore, recordedAudio.currentTime * 1000)
			renderer.drawPointer()
		}
	}
	requestAnimationFrame(drawframe)
}
drawframe()
// setInterval(drawframe, 1000/120)
function move(e) {
	if (!recorder.recording) return
	
	const rect = canvas.getBoundingClientRect()
	const events = e.getCoalescedEvents();
	events.forEach((e) => {
		let record = {type:eventTypes.move,coords:{x:Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top)}}
		recorder.record(record)
		playRecord(record)

	})

}
