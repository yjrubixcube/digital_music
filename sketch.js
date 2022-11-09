let img;

function setup() {
  createCanvas(690, 420);
  fill(0,255,255);

  img = loadImage("images/test.png");

}

function draw() {
  // background(0);
  // if (mouseIsPressed) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  // ellipse(mouseX, mouseY, 80, 80);

  // image(img, 0, 0);
  image(img, 0, height/2, img.width/2, img.height/2);
  
}