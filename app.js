var down = false
var prevX = 0
var currX = 0
var prevY = 0
var currY = 0
var frameShowsUpToEvent = 0

var recorder = new Recorder()
var renderer = new Renderer()
var canvas = renderer.canvas

// Register event handlers
canvas.addEventListener("mousemove", function (e) {
	move(e)
}, false);
canvas.addEventListener("mousedown", function (e) {
	if (recorder.recording){
		// Keep event recording of drawing outside should draw, as should draw may be called during recording to render frame
		shouldDraw(true)
		if (recorder.recording)
			recorder.record({type:"drawing", isDrawing: down})
		startDrawing(e)
	}
}, false);
canvas.addEventListener("mouseup", function (e) {
	if (recorder.recording){
		shouldDraw(false)
		recorder.record({type:"drawing", isDrawing: down })
	}
}, false);
canvas.addEventListener("mouseout", function (e) {
	if (recorder.recording) {
		shouldDraw(false)
		recorder.record({type:"drawing", isDrawing: down })
	}
}, false);

function shouldDraw (draw) {
	down = draw
	flag = true // Says that an event should be recorded for the next movement, as down state has changed
}

// Switch recording mode on/off
function recToggle(){
	recorder.recording = !recorder.recording
	document.getElementById('recBtn').innerText = recorder.recording ? "stop" : "rec"

	renderer.clear()
	down = false
	prevX = 0
	currX = 0
	prevY = 0
	currY = 0
	frameShowsUpToEvent = 0

	if (recorder.recording)
		recorder.startRecording()
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

	if (records[i].type == "move"){
		// set previous coords based on current, and load current from event
		renderer.previousPos.x = renderer.currentPos.x
		renderer.previousPos.y = renderer.currentPos.y
		renderer.currentPos.x = records[i].coords.x
		renderer.currentPos.y = records[i].coords.y
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
	if (records[i].type == "drawing"){
		flag = true
		renderer.down = records[i].isDrawing
		if (renderer.down)
			renderer.startedDrawing = true
	}

	if (i < records.length - 2){
		playEventRecursive(records,i+1, upTo)
		// setTimeout(function () {
		// playEventRecursive(records,i+1)
		// }, (records[i+1].time - records[i].time) * 0 )
	}
}

// is a record of coords required?
flag = false
function startDrawing(e){
	if (!recorder.recording) return
	prevX = currX;
	prevY = currY;
	currX = e.clientX - canvas.offsetLeft;
	currY = e.clientY - canvas.offsetTop;
}
setInterval(function(){
	if (recorder.recording){
		// renderer.clear()
		if (recorder.recordStore.length != 0){
			playEventRecursive(recorder.recordStore, frameShowsUpToEvent, 100000000)
			frameShowsUpToEvent = recorder.recordStore.length-1
		}
		if (flag){
			flag = false
			recorder.record({type:"move",coords:{x:currX, y: currY}})
			document.getElementById('fileSize').innerText = Math.round(JSON.stringify(recorder.recordStore).length/100)/10 + " KB"
		}

		// Pointer circle during recording
		// renderer.drawPointer()
	}else{
		renderer.clear()
		if (recorder.recordStore.length == 0)
			return
		playback(recorder.recordStore, recorder.recordStore[recorder.recordStore.length - 1].time * parseFloat(document.getElementById("myRange").value)/10000)
		renderer.drawPointer()
	}
}, 1000/160)
function move(e) {
	if (!recorder.recording) return

	flag = false
	if (prevX != currX || prevY != currY)
		flag = true

	prevX = currX;
	prevY = currY;
	currX = e.clientX - canvas.offsetLeft;
	currY = e.clientY - canvas.offsetTop;
	// if (down)
	// renderer.draw();
}
