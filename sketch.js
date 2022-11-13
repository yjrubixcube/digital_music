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

class Slider {
	constructor(bar, butt) {
		this.bar = bar;
		this.butt = butt;
	}

	get_val() {
		var ret = this.butt.x + this.butt.width/2 - this.bar.x;
		ret /= this.bar.width;
		// ret *= 1900;
		// ret += 100;

		ret = map(ret, 0, 1, 5, 95);
		ret *= 20;
		return ret;
	}
}

let bar = new Rectangle(bar_x, bar_y, bar_width, bar_height);
let button = new Rectangle(button_x, button_y, button_width, button_height);
let bar2 = new Rectangle(bar_x + 2*bar_width, bar_y, bar_width, bar_height);
let but2 = new Rectangle(button_x + 2*bar_width, button_y, button_width, button_height);

let freq_slider = new Slider(bar, button);
let speed_slider = new Slider(bar2, but2);
let start_button = new Rectangle(200, 500, 40, 40);
let stop_button = new Rectangle(300, 500, 40, 40);

let start_frame;
let freq;
let speed;

function setup() {
	createCanvas(screen[0], screen[1]);

	frameRate(50);

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
	start_button.render(color(0, 255, 0));
	stop_button.render(color(255, 0, 0));
	// change statement to pd things
	if (mouseIsPressed) {
		fill(color(255,255,0));
		rect(0, 0, 200, 200);
		if (freq_slider.butt.pressed_or_clicked()) {
			fill(color(255,0,0));
			rect(200, 0, 200, 200);
			if (mouseX > freq_slider.bar.x && mouseX < freq_slider.bar.x + freq_slider.bar.width){
				freq_slider.butt.x = mouseX - freq_slider.butt.width/2;
			}
			
		}
		if (speed_slider.butt.pressed_or_clicked()) {
			fill(color(255,0,0));
			rect(200, 0, 200, 200);
			if (mouseX > speed_slider.bar.x && mouseX < speed_slider.bar.x + speed_slider.bar.width){
				speed_slider.butt.x = mouseX - speed_slider.butt.width/2;
			}
			
		}
	}

	if (play && ((frameCount - start_frame) % (speed / 1000 * 60) < (freq / 1000 * 60) - 10)) {
		if (opach >= 0) {
			opach -= 51;
		}
	}
	else{
		if (opach <= 255) {
			opach += 51;
		}
	}
	
	freq_slider.bar.render(color(0));
	freq_slider.butt.render(color(255, 0, 0));
	speed_slider.bar.render(color(0));
	speed_slider.butt.render(color(255, 0, 0));

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
	if (start_button.pressed_or_clicked() && !play) {
		play = true;
		Pd.start();
		Pd.send("freq", [freq_slider.get_val()]);
		Pd.send("speed", [speed_slider.get_val()]);

		start_frame = frameCount;
		freq = freq_slider.get_val();
		speed = speed_slider.get_val();
		if (freq > speed) {
			freq = speed;
		}
	}
	if (stop_button.pressed_or_clicked() && play) {
		play = false;
		Pd.stop();
	}
}