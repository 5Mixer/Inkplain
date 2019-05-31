function Renderer () {

	this.canvas = document.getElementById('board')
	this.ctx = this.canvas.getContext('2d',{desynchronized:true, alpha: false})

	this.currentPos = { x: 0, y: 0}
	this.previousPos = { x: 0, y: 0}
	this.down = false

	w = this.canvas.width;
	h = this.canvas.height;

	this.brush = {
		thickness: 2,
		color: "black"
	}

	// background image
	var img = new Image();
	img.src = "bg.png"
	//Essentially a reset for the image
	this.clear = function () {
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0,0,w,h)
		this.ctx.fillStyle = "black"
		this.ctx.drawImage(img, 0, 0);
		this.brush = {
			thickness: 2,
			color: "black"
		}
		
		this.currentPos = { x: 0, y: 0}
		this.previousPos = { x: 0, y: 0}
		this.down = false
		this.startedDrawing = false // true means point is a start point - should not have a prev.
	}
	this.clear()
	this.draw = function() {
		this.ctx.beginPath()
		this.ctx.lineWidth = this.brush.thickness
		this.ctx.strokeStyle = this.brush.color
		this.ctx.lineJoin = this.ctx.lineCap = "round"
	
		// this.ctx.quadraticCurveTo(this.previousPos.x, this.previousPos.y, this.currentPos.x, this.currentPos.y)
		this.ctx.moveTo(this.previousPos.x, this.previousPos.y)
		this.ctx.lineTo(this.currentPos.x, this.currentPos.y)

		this.ctx.stroke()
		this.ctx.closePath()
	}
	this.drawPointer = function () {
		this.ctx.beginPath();
		this.ctx.lineWidth = 1
		this.ctx.arc(this.currentPos.x, this.currentPos.y, 5, 0, 2 * Math.PI);
		this.ctx.stroke();
	}


	return this
}
