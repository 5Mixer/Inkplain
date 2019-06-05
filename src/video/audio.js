function AudioManager () {
	navigator.mediaDevices.getUserMedia({audio:true})
		.then(stream => {this.handlerFunction(stream)})

	this.handlerFunction = function (stream) {
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
	this.sendData = function (data) {}
	
	this.startRecordingAudio = function () {
		audioChunks = [];
		rec.start();
	}
	this.stopRecordingAudio = function () {
		rec.stop();
	}

	return this
}
