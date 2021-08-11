let dicer;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  dicer = createDicer();

  // add a buttons to connect to the printer & to print!
  let connectButton = createButton('connect!');
  connectButton.position(20, 20);
  connectButton.mousePressed(function() {
    dicer.serial.requestPort();
  });

  let printButton = createButton('print!');
  printButton.position(20, 60);
  printButton.mousePressed(function() {
    dicer.print();
  });

  let stopButton = createButton('stop!');
    stopButton.position(20, 100);
    stopButton.mousePressed(function() {
      dicer.stopPrint(); // stop streaming the commands to printer
    });
}


function dicerDraw() {
  dicer.setERelative();
  dicer.fanOff();
  dicer.autoHome();
  dicer.setTemps(200, 55);
  dicer.introLine(); // line back and forth to clean nozzle

  let startHeight = 0.2;
  let ov = 2; // vertical offset
  let oh = 3; // horizontal offset
  let s = 2500;
  let x = 100;
  let y = 100;


  let h = startHeight; // for 2d tests
  let eAmount = 3;

  let r = 2.4/2; // or in general, map(i, 3, 9, 2.4, 4.2); (mesasured empirically)


  // make a spiral!
  let maxR = 24; // outer radius, chosen as multiple of r_dot
  let numSpirals = 11; // R/(2*r) + 1
  let center = createVector(dicer.maxX/2, dicer.maxY/2); // center the spiral on the print bed
  let z = 0.2;
  let cosTheta = (pow(maxR, 2) - 2 * pow(r, 2)) / (pow(maxR, 2)); // law of cosines!
  let step = acos( cosTheta );


  for (let angle = 0; angle <= numSpirals * TWO_PI; angle += step) {
    console.log(maxR);
    dicer.moveRetract(center.x + maxR * cos(angle), center.y + maxR * sin(angle), h, 3*s);
    dicer.moveExtrude(center.x + maxR * cos(angle),center.y + maxR * sin(angle), h + ov, 25, eAmount);

    maxR = (numSpirals * TWO_PI - angle) * (r/PI); // at 2*pi, maxR should be less by diameter of one dot 
    cosTheta = (pow(maxR, 2) - 2 * pow(r, 2)) / (pow(maxR, 2));
    step = acos( cosTheta );
  }

  dicer.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  dicer.render();
}