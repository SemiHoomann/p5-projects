
const TOTAL_ATTEMPTS = 10
const TOTAL_CIRCLES = 100
const MIN_CIRCLE_SIZE = 10
const MAX_CIRCLE_SIZE = 10

let circles = []
const COLORS = "https://coolors.co/palette/ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff"
const PALETTE = getPalette(COLORS)

function getPalette(url) {
	splits = url.split('/')
	colors = splits[splits.length-1].split("-")
	color_hex = colors.map(c => "#"+c)
	return color_hex
}	

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);	
	
	TOTAL_POINTS = 10 			
	DEVIATION = 10 
	// As deviation increase, total points must ddecrease	
	// Deviation shuld be close to circle size. Should not be more than half of radius
	
	ANGLE = TWO_PI/TOTAL_POINTS
}

function draw() {	
	for(let i=0; i < TOTAL_CIRCLES; i++){
		createCircle()
	}
	noLoop();	
}


function createCircle() {	
	let cir = {
		x : Math.floor(Math.random() * windowWidth),
		y : Math.floor(Math.random() * windowHeight),
		r : MIN_CIRCLE_SIZE
}
	
	if(!hasCollision(cir)){
		for(let j=0; j < TOTAL_ATTEMPTS; j++){
			if(!hasCollision(cir) && (cir.r < MAX_CIRCLE_SIZE)) {
				cir.r++
			}
			else{
				cir.r--
			}
		}
		circles.push(cir)
		fill(randomChoice(PALETTE))
		noStroke()
		makeBlob(cir.x, cir.y, cir.r*2)
		// circle(cir.x, cir.y, cir.r*2)
	}
}

function makeBlob(center_x, center_y, radius) {
	// translate(trans_x, trans_y);	
	beginShape();		
	for (var i = 0; i <= TOTAL_POINTS; i++) {
		var x = (Math.random() * DEVIATION) + center_x + (cos(ANGLE * i) * radius);
		var y = (Math.random() * DEVIATION) + center_y + (sin(ANGLE * i) * radius);
		curveVertex(x, y);
	}
	endShape();
}

function hasCollision(cir) {
	
	// Check for collisions with the edges
	if (cir.x + cir.r >= width ||
			cir.x - cir.r <= 0) {
		return true;
	}

	if (cir.y + cir.r >= height ||
			cir.y - cir.r <= 0) {
		return true;
	}
	
	for(let k=0; k<circles.length; k++){
		let dx = cir.x - circles[k].x
		let dy = cir.y - circles[k].y
		let distance = Math.sqrt((dx*dx) + (dy*dy))
		
		let rad = cir.r + circles[k].r
		
		if(rad >= distance){
			return true
		}		
	}
	return false
}