// const { memoryUsage } = require("process");

// global vars
let screen = [1280, 720];

// bar vars const
let button_width = 30, button_height = 100;
let bar_width = 200, bar_height = 10;
let bar_x = screen[0]/2 - bar_width/2, bar_y = screen[1] - button_height/2 - 5;
let button_x = screen[0]/2 - button_width/2, button_y = screen[1] - button_height - 5;


// img vars
let main_figure=[], sound_figure=[];
let character = 0;



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

		ret = map(ret, 0, 1, 5, 95);
		ret *= 20;
		if(ret < 300)	ret = 300;
		ret -= 100;
		return ret;
	}
}

class my_button {
	constructor(x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
	}

	pressed_or_clicked() {
		if (mouse_over(this)){
			return true;
		}
		else {
			return false;
		}
	}

	render() {
		image(this.img, this.x, this.y, this.width, this.height, 0, 0, this.img.width, this.img.height, COVER);
	}
}

let bar = new Rectangle(bar_x, bar_y, bar_width, bar_height);
let button = new Rectangle(button_x, button_y, button_width, button_height);
let bar2 = new Rectangle(bar_x + 2*bar_width, bar_y, bar_width, bar_height);
let but2 = new Rectangle(button_x + 2*bar_width, button_y, button_width, button_height);

let freq_slider = new Slider(bar, button);
let speed_slider = new Slider(bar2, but2);
let ho_button = new Rectangle(screen[0]/20, screen[1] - 90, 40, 40);
let huh_button = new Rectangle(screen[0]/20 - 40, screen[1] - 40, 40, 40);
let ah_button = new Rectangle(screen[0]/20 + 40, screen[1] - 40, 40, 40);
let start_image;
let stop_button = new Rectangle(screen[0]/20 + 150, screen[1] - 60, 40, 40);
let random_button = new Rectangle(screen[0]/20 + 300, screen[1] - 60, 40, 40);
let select_char = [];

let start_frame;
let freq;
let speed;

function setup() {
	createCanvas(screen[0], screen[1]);

	frameRate(50);

	main_figure.push(loadImage("images/beast_waiting.jpg"));
	main_figure.push(loadImage("images/billy_start.jpg"));
	main_figure.push(loadImage("images/wen_start.jpg"));
	for(let i = 0;i < 3;i++){
		sound_figure.push([]);
	}
	sound_figure[0].push(loadImage("images/beast_ho.jpg"));
	sound_figure[0].push(loadImage("images/beast_huh.jpg"));
	sound_figure[0].push(loadImage("images/beast_roar.jpg"));
	sound_figure[1].push(loadImage("images/billy_ho.jpg"));
	sound_figure[1].push(loadImage("images/billy_yee.jpg"));
	sound_figure[1].push(loadImage("images/billy_roar.jpg"));
	sound_figure[2].push(loadImage("images/wen_ho.jpg"));
	sound_figure[2].push(loadImage("images/wen_yee.jpg"));
	sound_figure[2].push(loadImage("images/wen_ah.jpg"));

	select_char.push(new my_button(50, screen[1] - 140, 50, 40, main_figure[0]));
	select_char.push(new my_button(170, screen[1] - 140, 50, 40, main_figure[1]));
	select_char.push(new my_button(290, screen[1] - 140, 50, 40, main_figure[2]));

	//start_image = loadImage("images/play.png");
	//start_button = new my_button(screen[0]/20, screen[1] - 60, 40, 40, start_image);
	
}

let play = false;
let rplay = false;
let opach = 0;
let s_type = 0;

function draw() {
	background(255);

	tint(255, opach);
	image(main_figure[character], 0, 0, width, height, 0, 0, main_figure[character].width, main_figure[character].height, COVER); //COVER or CONTAIN
	tint(255, 255-opach);
	image(sound_figure[character][s_type], 0, 0, width, height, 0, 0, sound_figure[character][s_type].width, sound_figure[character][s_type].height, COVER);
	ho_button.render(color(0, 255, 0));
	huh_button.render(color(0, 255, 0));
	ah_button.render(color(0, 255, 0));
	stop_button.render(color(255, 0, 0));
	random_button.render(color(0, 0, 255));
	noTint();
	select_char[0].render();
	select_char[1].render();
	select_char[2].render();
	// change statement to pd things
	if (mouseIsPressed) {
		if (freq_slider.butt.pressed_or_clicked()) {
			if (mouseX > freq_slider.bar.x && mouseX < freq_slider.bar.x + freq_slider.bar.width){
				freq_slider.butt.x = mouseX - freq_slider.butt.width/2;
			}
			
		}
		if (speed_slider.butt.pressed_or_clicked()) {
			if (mouseX > speed_slider.bar.x && mouseX < speed_slider.bar.x + speed_slider.bar.width){
				speed_slider.butt.x = mouseX - speed_slider.butt.width/2;
			}
			
		}
	}

	if(rplay && (frameCount - start_frame) % 15 == 0){
		freq = random(400, 1600);
		speed = 250;
		s_type = random([0, 1, 2]);
		Pd.send("type", [s_type]);
		Pd.send("freq", [freq]);
		Pd.send("speed", [speed]);
	}

	if ((play && ((frameCount - start_frame) % (speed / 1000 * 60) < (min(freq, speed) / 1000 * 60) - 10)) ||
		(rplay && (frameCount - start_frame) % 15 <= 8)) {
		if (opach >= 0) {
			opach -= 200;

			if(opach < 0)
				opach = 0;
		}
	}
	else{
		if (opach <= 255) {
			opach += 200;

			if(opach > 255)
				opach = 255;
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
	if (ho_button.pressed_or_clicked() && !play) {
		play = true;
		Pd.start();

		start_frame = frameCount;
		freq = freq_slider.get_val();
		speed = speed_slider.get_val();
		s_type = 0;
		Pd.send("type", [0]);
		Pd.send("freq", [freq]);
		Pd.send("speed", [speed]);
	}
	if (huh_button.pressed_or_clicked() && !play) {
		play = true;
		Pd.start();

		start_frame = frameCount;
		freq = freq_slider.get_val();
		speed = speed_slider.get_val();
		s_type = 1;
		Pd.send("type", [1]);
		Pd.send("freq", [freq]);
		Pd.send("speed", [speed]);
	}
	if (ah_button.pressed_or_clicked() && !play) {
		play = true;
		Pd.start();

		start_frame = frameCount;
		freq = freq_slider.get_val();
		speed = speed_slider.get_val();
		s_type = 2;
		Pd.send("type", [2]);
		Pd.send("freq", [freq]);
		Pd.send("speed", [speed]);
	}
	if (stop_button.pressed_or_clicked() && (play || rplay)) {
		play = false;
		rplay = false;
		Pd.stop();
	}
	if (random_button.pressed_or_clicked() && !play) {
		rplay = true;
		Pd.start();

		start_frame = frameCount;
	}

	for (let i = 0; i<select_char.length; i++){
		if (select_char[i].pressed_or_clicked() && !play){
			character = i;
			break;
		}
	}
}

function min(a, b){
	if(a <= b) return a;
	else return b;
}