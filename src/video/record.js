function Recorder(){
	this.recordStore = []
	this.recording = false
	this.startTime = 0
	this.recordingLength = 0

	this.startRecording = function (){
		this.recording = true
		this.recordStore = []
		this.startTime = new Date().getTime()
	}

	this.record = function (event){
		event.time = new Date().getTime() - this.startTime
		if (this.recording)
			this.recordStore.push(event)
	}

	this.stopRecording = function () {
		this.recording = false
		if (this.recordStore.length > 0)
			this.recordingLength = this.recordStore[this.recordStore.length - 1].time
	}
	return this;
}
export { Recorder }
