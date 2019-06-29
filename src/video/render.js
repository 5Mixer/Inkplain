function Renderer (canvas) {

	this.canvas = canvas //document.getElementById('board')
	this.ctx = this.canvas.getContext('2d',{desynchronized:true, alpha: false})

	this.currentPos = { x: 0, y: 0}
	this.previousPos = { x: 0, y: 0}
	this.down = false
	this.inCanvas = false // Should the pointer be shown?

	this.brush = {
		thickness: 2,
		colour: "black",
		opacity: 1
	}

	// background image
	var img = new Image();
	img.src = "bg.png"
	//Essentially a reset for the image
	this.clear = function () {
		this.ctx.globalAlpha = 1

		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.fillStyle = "black"
			
		this.ctx.lineJoin = "round"
		this.ctx.lineCap = "round"
		
		// this.ctx.drawImage(img, 0, 0);

		this.currentPos = { x: 0, y: 0}
		this.previousPos = { x: 0, y: 0}
		this.down = false
		this.inCanvas = false
		this.startedDrawing = false // true means point is a start point - should not have a prev.
	}
	this.clear()

	this.move = function (x,y) {
		this.previousPos.x = this.currentPos.x
		this.previousPos.y = this.currentPos.y
		this.currentPos.x = x
		this.currentPos.y = y

		if (this.startedDrawing) {
			this.startedDrawing = false
			this.ctx.moveTo(x,y)
		}
		if (this.down){
			this.ctx.lineWidth = this.brush.thickness
			this.ctx.strokeStyle = this.brush.colour

			this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
		}

	}
	this.penUp = function () { 
		this.down = false
		this.ctx.stroke()
	}
	this.penDown = function () {
		this.down = true; 
		this.ctx.beginPath()
		this.startedDrawing = true
	}
	
	this.penEnter = function () { 
		this.inCanvas = true
	}
	this.penLeave = function () { 
		this.inCanvas = false
	}

	this.draw = function() {
		this.ctx.beginPath()

		// this.ctx.quadraticCurveTo(this.previousPos.x, this.previousPos.y, this.currentPos.x, this.currentPos.y)
		this.ctx.moveTo(this.previousPos.x, this.previousPos.y)
		this.ctx.lineTo(this.currentPos.x, this.currentPos.y)

		this.ctx.stroke()
	}
	this.drawPointer = function () {
		if (this.inCanvas) {
			this.ctx.globalAlpha = 1
			this.ctx.beginPath();
			this.ctx.lineWidth = 2
			this.ctx.arc(this.currentPos.x, this.currentPos.y, this.brush.thickness, 0, 2 * Math.PI);
			this.ctx.stroke();
		}
	}
	this.brushLoad = function () {
		this.ctx.lineWidth = this.brush.thickness
		this.ctx.strokeStyle = this.brush.colour
		this.ctx.globalAlpha = this.brush.opacity
	}

	return this
}
export { Renderer }
