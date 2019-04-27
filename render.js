function Renderer () {

	this.canvas = document.getElementById('board')
	this.ctx = this.canvas.getContext('2d')

	this.currentPos = { x: 0, y: 0}
	this.previousPos = { x: 0, y: 0}
	this.down = false

	w = this.canvas.width;
	h = this.canvas.height;

	// background image
	var img = new Image();
	img.src = "bg.png"
	//Essentially a reset for the image
	this.clear = function () {
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0,0,w,h)
		this.ctx.fillStyle = "black"
		this.ctx.drawImage(img, 0, 0);
		
		this.currentPos = { x: 0, y: 0}
		this.previousPos = { x: 0, y: 0}
		this.down = false
		this.startedDrawing = false // true means point is a start point - should not have a prev.
	}
	this.draw = function() {
		this.ctx.beginPath()
		this.ctx.lineWidth = 2
		this.ctx.lineJoin = this.ctx.lineCap = "round"
		// this.ctx.moveTo(prevX, prevY)
		// this.ctx.lineTo(currX, currY)
	
		this.ctx.quadraticCurveTo(this.previousPos.x, this.previousPos.y, this.currentPos.x, this.currentPos.y)


		this.ctx.stroke()
		this.ctx.closePath()
	}
	this.drawPointer = function () {
		this.ctx.beginPath();
		this.ctx.lineWidth = 1
		this.ctx.arc(currX, currY, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
	}


	return this
}
