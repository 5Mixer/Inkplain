function Recorder(){
	this.recordStore = []
	this.recording = false
	this.startTime = 0

	this.startRecording = function (){
		this.recordStore = []
		this.startTime = new Date().getTime()
	}

	this.record = function (event){
		event.time = new Date().getTime() - this.startTime
		if (this.recording)
			this.recordStore.push(event)
	}
}
export { Recorder }
