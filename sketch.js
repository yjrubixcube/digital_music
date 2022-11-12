// global vars
let screen = [1080, 540];

// img vars
let main_figure;
let max_width = screen[0]/5, max_height = screen[1]/5;
let min_width = screen[0]/10, min_height = screen[1]/10;
let cur_width = max_width, cur_height = max_height;



function move_mouth() {
	main_figure = loadImage("images/test.png");
}

function render_buttons(x_pos, y_pos, width, height, color) {
	fill(color);
	rect(x_pos, y_pos, width, height);
}

function setup() {
	createCanvas(screen[0], screen[1]);
	// fill(0, 255, 255);
	move_mouth()
}


function draw() {
	background(255);

	// change statement to pd things
	if (mouseIsPressed) {
		if (cur_width < max_width){
			cur_width += 2;
			cur_height += 1;
		}
	}
	else{
		if (cur_width > min_width){
			cur_width -= 2;
			cur_height -= 1;
		}
	}

	image(main_figure, mouseX, mouseY, cur_width, cur_height);

	render_buttons(400, 200, 100, 300, 125);

}