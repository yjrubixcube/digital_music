// const { memoryUsage } = require("process");

let melody = [[5,0.12],[6,0.12],[10,0.12],[5,0.12],[30,0.36],[30,0.36],[20,0.72],[5,0.12],[6,0.12],[7,0.12],[5,0.12],[20,0.36],[20,0.36],[10,0.72]];
let note = [0, 1054.94, 939.85, 837.31, 790.31, 704.09, 627.27, 558.84];

// global vars
let screen = [1280, 720];

// bar vars const
let button_width = 30, button_height = 100;
let bar_width = 200, bar_height = 10;
let bar_x = screen[0]/2 - 150 - bar_width/2, bar_y = screen[1] - button_height/2 - 5;
let button_x = screen[0]/2 - 150 - button_width/2, button_y = screen[1] - button_height - 5;

// buffer_bar vars
let buffer_bar_width = 1250, buffer_bar_height = 100;
let buffer_bar_x = 10, buffer_bar_y = 10;


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
		fill(col, 127);
		rect(this.x, this.y, this.width, this.height);
	}
}

class Slider {
	constructor(bar, butt) {
		this.bar = bar;
		this.butt = butt;
	}

	get_val() {
		var ret = this.bar.x + this.bar.width - (this.butt.x + this.butt.width/2);
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

class State {
	constructor(character, sound_type, freq, speed, volume) {
		this.character = character;
		this.sound_type = sound_type;
		this.freq = freq;
		this.speed = speed;
		this.volume = volume;
	}
}

let bar = new Rectangle(bar_x, bar_y, bar_width, bar_height);
let button = new Rectangle(button_x, button_y, button_width, button_height);
let bar2 = new Rectangle(bar_x + 1.5 * bar_width, bar_y, bar_width, bar_height);
let but2 = new Rectangle(button_x + 1.5 * bar_width, button_y, button_width, button_height);

let freq_slider = new Slider(bar, button);
let speed_slider = new Slider(bar2, but2);
/*let ho_button = new Rectangle(screen[0]/20, screen[1] - 90, 40, 40);
let huh_button = new Rectangle(screen[0]/20 - 40, screen[1] - 40, 40, 40);
let ah_button = new Rectangle(screen[0]/20 + 40, screen[1] - 40, 40, 40);*/
let ho_button;
let huh_button;
let del_button;
let ah_button;
let buffer_bar = new Rectangle(buffer_bar_x, buffer_bar_y, buffer_bar_width, buffer_bar_height);

let start_image;
let stop_image;
let del_image;
let random_image;
let freq_image;
let speed_image;
let roll_image;
let clear_iamge;
//let stop_button = new Rectangle(screen[0]/20 + 150, screen[1] - 60, 40, 40);
let start_button;
let stop_button;
let random_button;
let roll_button;
let clear_button
//let random_button = new Rectangle(screen[0]/20 + 300, screen[1] - 60, 40, 40);
let select_char = [];
let buffer = [];
let butt_images = [];

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

	select_char.push(new my_button(25, screen[1] - 140, 50, 40, main_figure[0]));
	select_char.push(new my_button(125, screen[1] - 140, 50, 40, main_figure[1]));
	select_char.push(new my_button(225, screen[1] - 140, 50, 40, main_figure[2]));

	start_image = loadImage("images/play.png");
	start_button = new my_button(screen[0] - 370, screen[1] - 125, 100, 100, start_image);
	stop_image = loadImage("images/stop.png");
	stop_button = new my_button(screen[0] - 240, screen[1] - 125, 100, 100, stop_image);
	random_image = loadImage("images/weed.png");
	random_button = new my_button(screen[0] - 110, screen[1] - 125, 100, 100, random_image);
	roll_image = loadImage("images/roll.jpg");
	roll_button = new my_button(screen[0] - 25, screen[1] - 25, 20, 20, roll_image);

	butt_images.push(loadImage("images/HO.jpg"));
	butt_images.push(loadImage("images/HE.jpg"));
	butt_images.push(loadImage("images/AH.jpg"));
	ho_button = new my_button(screen[0]/20, screen[1] - 90, 40, 40, butt_images[0]);
	huh_button = new my_button(screen[0]/20 - 40, screen[1] - 40, 40, 40, butt_images[1]);
	ah_button = new my_button(screen[0]/20 + 40, screen[1] - 40, 40, 40, butt_images[2]);
	del_image = loadImage("images/back.png");
	del_button = new my_button(screen[0]/20 + 100, screen[1] - 75, 55, 55, del_image);
	clear_iamge = loadImage("images/del.png");
	clear_button = new my_button(screen[0]/20 + 180, screen[1] - 75, 55, 55, clear_iamge);
	
	freq_image = loadImage("images/freq.png");
	speed_image = loadImage("images/sanic.png");
}

let play = false;
let rplay = false;
let roll_play = false;
let opach = 0;
let s_type = 0;

let index;
let r_index;

function draw() {
	background(255);

	tint(255, opach);
	image(main_figure[character], 0, 0, width, height, 0, 0, main_figure[character].width, main_figure[character].height, COVER); //COVER or CONTAIN
	tint(255, 255-opach);
	image(sound_figure[character][s_type], 0, 0, width, height, 0, 0, sound_figure[character][s_type].width, sound_figure[character][s_type].height, COVER);
	noTint();
	start_button.render();
	stop_button.render();
	random_button.render();
	roll_button.render();
	ho_button.render();
	huh_button.render();
	ah_button.render();
	del_button.render();
	clear_button.render();
	image(freq_image, freq_slider.bar.x - 65, freq_slider.bar.y - 35, 60, 80);
	image(speed_image, speed_slider.bar.x - 85, speed_slider.bar.y - 50, 100, 100);
	buffer_bar.render(color(127,127,127, 127));
	noTint();
	for (let i = int((buffer.length - 1) /  11) * 11; i < buffer.length; i++){
		tint(255, 191);
		image(butt_images[buffer[i].sound_type], buffer_bar_x + 10 + (i % 11)*(100+10), buffer_bar_y + 10, 100, 80, 0, 0, butt_images[buffer[i].sound_type].width, butt_images[buffer[i].sound_type].height, COVER); //100,80
	}
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
	
	if(play){
		if(frameCount - start_frame > speed / 1000 * 60){
			index++;

			Pd.send("vol0", [0]);
			Pd.send("vol1", [0]);
			Pd.send("vol2", [0]);
			if(index < buffer.length){
				s_type = buffer[index].sound_type;
				freq = buffer[index].freq;
				speed = buffer[index].speed;
				if(s_type == 0){
					Pd.send("freq0", [freq]);
					Pd.send("speed0", [speed]);
					Pd.send("vol0", [1]);
				}
				else if(s_type == 1){
					Pd.send("freq1", [freq]);
					Pd.send("speed1", [speed]);
					Pd.send("vol1", [1]);
				}
				else{
					Pd.send("freq2", [freq]);
					Pd.send("speed2", [speed]);
					Pd.send("vol2", [1]);
				}
				start_frame = frameCount;
			}
			else{
				//buffer.length = 0;
				play = false;
				Pd.stop();
			}
		}
	}

	if(rplay && (frameCount - start_frame) % 15 == 0){
		Pd.send("vol0", [0]);
		Pd.send("vol1", [0]);
		Pd.send("vol2", [0]);
		
		freq = random(400, 1600);
		speed = 250;
		s_type = random([0, 1, 2]);
		if(s_type == 0){
			Pd.send("freq0", [freq]);
			Pd.send("speed0", [speed]);
			Pd.send("vol0", [1]);
		}
		else if(s_type == 1){
			Pd.send("freq1", [freq]);
			Pd.send("speed1", [speed]);
			Pd.send("vol1", [1]);
		}
		else{
			Pd.send("freq2", [freq]);
			Pd.send("speed2", [speed]);
			Pd.send("vol2", [1]);
		}
	}

	if (roll_play){
		if (frameCount - start_frame > speed / 1000 * 60) {
			
			r_index ++;
			Pd.send("vol0", [0]);
			Pd.send("vol1", [0]);
			Pd.send("vol2", [0]);
			if (r_index < melody.length) {
				speed = melody[r_index][1]*1000;
				if(melody[r_index][0]>=10){
					freq = note[melody[r_index][0]/10]/2;
				}
				else{
					freq = note[melody[r_index][0]];
				}
				Pd.send("freq0", [freq]);
				Pd.send("speed0", [speed]);
				Pd.send("vol0", [1]);
				start_frame = frameCount;
			}
			else {
				roll_play = false;
				Pd.stop();
			}
		}
	}

	if ((play && index < buffer.length && ((frameCount - start_frame) % (speed / 1000 * 60) < (min(freq, speed) / 1000 * 60) - 10)) ||
		(rplay && (frameCount - start_frame) % 15 <= 8) ||
		(roll_play && ((frameCount - start_frame) % (speed / 1000 * 60) < (min(freq, speed) / 1000 * 60) - 3))) {
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
		buffer.push(new State(character, 0, freq_slider.get_val(), speed_slider.get_val(), 1));
	}
	if (huh_button.pressed_or_clicked() && !play) {
		buffer.push(new State(character, 1, freq_slider.get_val(), speed_slider.get_val(), 1));
	}
	if (ah_button.pressed_or_clicked() && !play) {
		buffer.push(new State(character, 2, freq_slider.get_val(), speed_slider.get_val(), 1));
	}
	if (del_button.pressed_or_clicked() && !play) {
		buffer.pop();
	}
	if (clear_button.pressed_or_clicked() && !play) {
		buffer.length = 0;
	}
	if (start_button.pressed_or_clicked() && !play && !rplay && !roll_play && buffer.length) {
		play = true;
		index = 0;
		Pd.start();
		s_type = buffer[index].sound_type;
		freq = buffer[index].freq;
		speed = buffer[index].speed;
		if(s_type == 0){
			Pd.send("freq0", [freq]);
			Pd.send("speed0", [speed]);
			Pd.send("vol0", [1]);
		}
		else if(s_type == 1){
			Pd.send("freq1", [freq]);
			Pd.send("speed1", [speed]);
			Pd.send("vol1", [1]);
		}
		else{
			Pd.send("freq2", [freq]);
			Pd.send("speed2", [speed]);
			Pd.send("vol2", [1]);
		}
		start_frame = frameCount;
	}
	if (stop_button.pressed_or_clicked() && (play || rplay || roll_play)) {
		//buffer.length = 0;
		play = false;
		rplay = false;
		roll_play = false;
		Pd.send("vol0", [0]);
		Pd.send("vol1", [0]);
		Pd.send("vol2", [0]);
		Pd.stop();
		speed = 0;
	}
	if (random_button.pressed_or_clicked() && !play && !roll_play) {
		rplay = true;
		Pd.start();

		start_frame = frameCount;
	}
	if (roll_button.pressed_or_clicked() && !play && !rplay) {
		roll_play = true;
		r_index = 0;
		Pd.start();
		speed = melody[r_index][1]*1000;
        if(melody[r_index][0]>=10){
            freq = note[melody[r_index][0]/10]/2;
        }
        else{
            freq = note[melody[r_index][0]];
        }
        Pd.send("freq0", [freq]);
        Pd.send("speed0", [speed]);
        Pd.send("vol0", [1]);
		s_type = 2;
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