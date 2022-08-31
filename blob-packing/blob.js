
const TOTAL_ATTEMPTS = 20
const TOTAL_CIRCLES = 2000
const MIN_CIRCLE_SIZE = 5
const MAX_CIRCLE_SIZE = 40

let circles = []
// const COLORS = "https://coolors.co/palette/ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff"
// const COLORS = "https://coolors.co/palette/ea698b-d55d92-c05299-ac46a1-973aa8-822faf-6d23b6-6411ad-571089-47126b"
// const PALETTE = getPalette(COLORS)
const PALETTE = [
	[344, 55, 92],
	[334, 56, 84],
	[321, 57, 75],
	[306, 59, 67],
	[291, 65, 66],
	[279, 73, 69],
	[270, 81, 71],
	[272, 90, 68],
	[275, 88, 54],
	[276, 83, 42]
]

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
	background(0);	
	
	TOTAL_POINTS = 10 			
	DEVIATION = 2 
	// As deviation increase, total points must ddecrease	
	// Deviation shuld be close to circle size. Should not be more than half of radius
	
	ANGLE = TWO_PI/TOTAL_POINTS
	colorMode(HSB);
}

function draw() {	
	for(let i=0; i < TOTAL_CIRCLES; i++){
		createCircle()
	}
	// fill('white')
	// rect(0,0,20,height)
	// rect(width-20,0,20,height)
	// rect(0,0,width,20)
	// rect(0,height-20, width, 20)
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
		c = randomChoice(PALETTE)
		fill(c[0], c[1], c[2] + (Math.random()*20))
		
		noStroke()
		makeBlob(cir.x, cir.y, cir.r*2)
		// circle(cir.x, cir.y, cir.r*2)
	}
}

function makeBlob(center_x, center_y, radius) {
	let deviation = DEVIATION * radius/5
	let blob_points = []
	// translate(trans_x, trans_y);	
	beginShape();		
	for (var i = 0; i <= TOTAL_POINTS; i++) {
		var x = (Math.random() * deviation) + center_x + (cos(ANGLE * i) * radius);
		var y = (Math.random() * deviation) + center_y + (sin(ANGLE * i) * radius);
		if(x< 20){ x=20 + (Math.random()*10)}
		else{ if(x>width-20){x=width-20 - (Math.random()*10)}}
		
		if(y< 20){ y=20 + (Math.random()*10)}
		else{ if(y>height-20){y=height-20 - (Math.random()*5)}}
		
			
		blob_points.push({'x':x, 'y':y, 'r':radius})
		curveVertex(x, y);		
	}
	endShape();	
	makeShadowBlob(blob_points, radius)
	makeShadowBlob(blob_points, radius)
	makeShadowBlob(blob_points, radius)
}

function makeShadowBlob(blob, radius) {
	console.log(blob[0].x)
	let deviation = DEVIATION * radius/5
	fill('rgba(0,0,0, 0.10)');
	beginShape()
	for(var j=0; j <blob.length; j++) {
		new_x = blob[j].x + (Math.random() * deviation)
		new_y = blob[j].y + (Math.random() * deviation)
		
		curveVertex(new_x,new_y)
	}
	endShape()
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
		
		if(rad*2 >= distance){
			return true
		}		
	}
	return false
}