// const { memoryUsage } = require("process");

// global vars
let screen = [1080, 540];

// bar vars const
let bar_x = 440, bar_y = 500;
let bar_width = 200, bar_height = 10;

// img vars
// let main_figure;
// let max_width = screen[0]/5, max_height = screen[1]/5;
// let min_width = screen[0]/10, min_height = screen[1]/10;
// let cur_width = max_width, cur_height = max_height;

// button vars
let button_x = 525, button_y = 490;
let button_width = 30, button_height = 30;

function setup() {
	createCanvas(screen[0], screen[1]);
	// fill(0, 255, 255);
}
// function move_mouth() {
// 	main_figure = loadImage("images/test.png");
// }


function draw() {
	background(255);

	// change statement to pd things
	if (mouseIsPressed) {
		if (mouse_over(button_x, button_x + button_width, button_y, button_y + button_height) === true) {
			button_x = mouseX - button_width/2;
		}
	}
	// else{
	// 	// if (cur_width > min_width){
	// 	// 	cur_width -= 2;
	// 	// 	cur_height -= 1;
	// 	// }
	// }

	// image(main_figure, mouseX, mouseY, cur_width, cur_height);

	render_rect(bar_x, bar_y, bar_width, bar_height, color(0,0,0));
	render_rect(button_x, button_y, button_width, button_height, color(255,0,0));

}

function mouse_over(x_start, x_end, y_start, y_end) {
	if (mouseX >= x_start && mouseX <= x_end && mouseY >= y_start && mouseY <= y_end) {
		return true;
	}
	else {
		return false;
	}
}

function render_rect(x_pos, y_pos, width, height, color) {
	fill(color);
	rect(x_pos, y_pos, width, height);
}