navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {handlerFunction(stream)})

function handlerFunction(stream) {
	rec = new MediaRecorder(stream);
	rec.ondataavailable = e => {
		audioChunks.push(e.data);
		if (rec.state == "inactive"){
			let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
			recordedAudio.src = URL.createObjectURL(blob);
			recordedAudio.controls=true;
			recordedAudio.autoplay=true;
			sendData(blob)
		}
	}
}
function sendData(data) {}

// recordedAudio.addEventListener("timeupdate", function (e) {
// 	console.log(e)
// })

function startRecordingAudio() {
	audioChunks = [];
	rec.start();
}
function stopRecordingAudio() {
	rec.stop();
}
