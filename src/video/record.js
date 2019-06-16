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
	
	this.eventType = {
		clear: 1,
		down: 2,
		up: 3,
		move : 4,
		brush: 5
	}

	// type: UInt8 (1 byte)
	// time: UInt32 (4 bytes)
	// x: UInt16 (2 bytes)
	// y: UInt16 (2 bytes)
	// colour: UInt32 (4 bytes, rgba)
	// width: UInt8 (1 byte)
	this.eventTypes = {
		1 : [ 'time' ],
		2 : [ 'time' ],
		3 : [ 'time' ],
		4 : [ 'time', 'x', 'y'],
		5 : [ 'time', 'colour', 'width']
	}
	this.encodeEvent = function (eventType, ...eventProps) {
		if (this.eventTypes[eventType].length == eventProps.length) {
			for (var i = 0; i < eventProps.length; i++){
				if ((eventProps[i]) > Math.pow(4, 64)){
					throw(`Tried to store data greater than 4 bytes (value ${eventProps[i]}) in event ${eventType}`)
				}
			}

			this.recordStore.push(eventType) 
			this.recordStore.push(...eventProps)
		} else {
			throw(`attemped to store event with invalid number of arguments`)
		}
	}


	this.record = function (event){

		if (this.recording){
			event.time = new Date().getTime() - this.startTime
			this.recordingLength = event.time

			//this.recordStore.push(event)
			switch (event.type) {
				case this.eventType.clear: {
					this.encodeEvent(event.type, event.time)
					break
				}
				case this.eventType.up: {
					this.encodeEvent(event.type, event.time)
					break
				}
				case this.eventType.down: {
					this.encodeEvent(event.type, event.time)
					break
				}
				case this.eventType.move: {
					this.encodeEvent(event.type, event.time, event.coords.x, event.coords.y)
					break
				}
				case this.eventType.brush: {
					console.log(event)
					this.encodeEvent(event.type, event.time, event.brush.colour, event.brush.thickness)
					break
				}
				default: {
					console.log(event)
				}
			}

		}
	}

	this.stopRecording = function () {
		this.recording = false
		if (this.recordStore.length > 0)
			this.recordingLength = this.recordStore[this.recordStore.length - 1].time
	}
	return this;
}
export { Recorder }
