let maxval = randomIntFromInterval(20, 30)
const TOTAL_ATTEMPTS = maxval
const TOTAL_CIRCLES = 1000
const MIN_CIRCLE_SIZE = randomIntFromInterval(5,10)
const MAX_CIRCLE_SIZE = maxval

const POLYGON_SIDES = randomChoice([3,4,5,10])

let circles = []
let circles2 = []
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

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);	
	
	TOTAL_POINTS = 10 			
	DEVIATION = 2 
	// As deviation increase, total points must ddecrease	
	// Deviation shuld be close to circle size. Should not be more than half of radius
	
	ANGLE = TWO_PI/TOTAL_POINTS
	POLYGON_RADIUS = windowWidth/2 //*3/4
	colorMode(HSB);
}

function createPolygon(x, y, radius, npoints, draw=false) {
	let poly = []
  let angle = TWO_PI / npoints;
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    poly.push(createVector(sx, sy))
  }
	
	if(draw){
		beginShape();
		for (const { x, y } of poly)  vertex(x, y);
		endShape(CLOSE);
	}
	
	return poly	
}

function draw() {	
	poly = createPolygon(width/2, height/2, POLYGON_RADIUS , POLYGON_SIDES)

	// poly_neg = false
	poly_neg = createPolygon(width/2, height/2, POLYGON_RADIUS/2 , POLYGON_SIDES)

	for(let i=0; i < TOTAL_CIRCLES; i++){
		createCircle(poly)
	}
	noLoop();	
}


function createCircle(poly) {	
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

		if(poly_neg){
			if(collideCirclePoly(cir.x, cir.y, cir.r, poly, true) && !collideCirclePoly(cir.x, cir.y, cir.r, poly_neg, true)){
					circles.push(cir)
					noStroke()
					makeBlob(cir.x, cir.y, cir.r*2)
			 }
		}
		else{
			if(collideCirclePoly(cir.x, cir.y, cir.r, poly, true)){
					circles.push(cir)
					noStroke()
					makeBlob(cir.x, cir.y, cir.r*2)
			 }
		}
	}
}

function makeBlob(center_x, center_y, radius) {
	let deviation = DEVIATION * radius/5
	let blob_points = []
	
	c = randomChoice(PALETTE)
	blob_color = color(c[0], c[1], c[2] + (Math.random()*20))
	fill(blob_color)
	
	// calculate blob points
	for (var i = 0; i <= TOTAL_POINTS; i++) {
		var x = (Math.random() * deviation) + center_x + (cos(ANGLE * i) * radius);
		var y = (Math.random() * deviation) + center_y + (sin(ANGLE * i) * radius);
		if(x< 20){ x=20 + (Math.random()*10)}
		else{ if(x>width-20){x=width-20 - (Math.random()*10)}}
		
		if(y< 20){ y=20 + (Math.random()*10)}
		else{ if(y>height-20){y=height-20 - (Math.random()*5)}}
			
		// blob_points.push({'x':x, 'y':y, 'r':radius})
		blob_points.push(createVector(x,y))
				
	}
	
	//draw the blob
		beginShape();		
		for(let b=0; b< blob_points.length; b++) {
			curveVertex(blob_points[b].x, blob_points[b].y);
		}
		endShape();	

	// add shadow to blob
	makeShadowBlob(blob_points, radius, 'rgba(0,0,0, 0.10)')
	makeShadowBlob(blob_points, radius, 'rgba(0,0,0, 0.10)')
	makeShadowBlob(blob_points, radius, 'rgba(0,0,0, 0.10)')
}

function makeShadowBlob(blob, radius, rgba_color) {
	let deviation = DEVIATION * radius/5
	fill(rgba_color);
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