// const { memoryUsage } = require("process");

// global vars
let screen = [1080, 540];

// bar vars const
let bar_x = 440, bar_y = 500;
let bar_width = 200, bar_height = 10;

// img vars
let main_figure, sound_figure;

// button vars
let button_x = 525, button_y = 455;
let button_width = 30, button_height = 100;

class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	pressed_or_clicked() {
		if (mouse_over(this)){
			return true;
		}
		else {
			return false;
		}
	}

	render(col) {
		fill(col);
		rect(this.x, this.y, this.width, this.height);
	}
}

let bar = new Rectangle(bar_x, bar_y, bar_width, bar_height);
let button = new Rectangle(button_x, button_y, button_width, button_height);
let start = new Rectangle(200, 500, 40, 40);

function setup() {
	createCanvas(screen[0], screen[1]);

	main_figure = loadImage("images/beast_waiting.jpg");
	sound_figure = loadImage("images/beast_roar.jpg");
}

let play = false;
let opach = 0;

function draw() {
	background(255);

	tint(255, opach);
	image(main_figure, 0, 0, width, height, 0, 0, main_figure.width, main_figure.height, COVER);
	tint(255, 255-opach);
	image(sound_figure, 0, 0, width, height, 0, 0, sound_figure.width, sound_figure.height, COVER);
	start.render(color(0, 255, 0));
	// change statement to pd things
	if (mouseIsPressed) {
		// play = !play;
		fill(color(255,255,0));
		rect(0, 0, 200, 200);
		if (button.pressed_or_clicked()) {
			fill(color(255,0,0));
			rect(200, 0, 200, 200);
			if (mouseX > bar.x && mouseX < bar.x + bar.width){
				button.x = mouseX - button.width/2;
			}
			
		}
	}

	if (play) {
		if (opach >= 0) {
			opach -= 15;
		}
		Pd.send("freq", [1000]);
		Pd.send("speed", [1000]);
	}
	else{
		if (opach <= 255) {
			opach += 15;
		}
	}
	
	bar.render(color(0));
	button.render(color(255, 0, 0));

}

function mouse_over(shape) {
	if (mouseX >= shape.x && mouseX <= shape.x + shape.width && mouseY >= shape.y && mouseY <= shape.y + shape.height) {
		return true;
	}
	else {
		return false;
	}
}


function mouseClicked() {
	if (start.pressed_or_clicked()) {
		play = !play;
		if (play) {
			Pd.start();
			
		}else{
			Pd.stop();
		}
	}
}