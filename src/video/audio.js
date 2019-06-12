function AudioManager (audioElement) {
	this.activateAudio = function() {
		navigator.mediaDevices.getUserMedia({audio:true})
		.then(stream => {this.handlerFunction(stream)})
	}
	this.handlerFunction = function (stream) {
		this.rec = new MediaRecorder(stream);
		this.rec.ondataavailable = e => {
			this.audioChunks.push(e.data);
			if (this.rec.state == "inactive"){
				let blob = new Blob(this.audioChunks,{type:'audio/mpeg-3'});
				audioElement.src = URL.createObjectURL(blob);
				audioElement.controls=true;
				audioElement.autoplay=true;
				this.sendData(blob)
			}
		}
	}
	this.sendData = function (data) {}
	
	this.startRecordingAudio = function () {
		this.audioChunks = [];
		this.rec.start();
	}
	this.stopRecordingAudio = function () {
		if (this.rec != undefined)
			this.rec.stop();
	}

	return this
}
export {AudioManager}
