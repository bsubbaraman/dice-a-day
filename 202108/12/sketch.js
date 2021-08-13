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
  dicer.setTemps(200, 60);
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
  let yoff = 0;

  for (let eAmount = 3; eAmount <=9; eAmount++){ 
    for (let i = 0; i < 7; i++) {
      let xoff = map(eAmount, 3, 9, 2.4, 4.1); // (mesasured empirically)
      dicer.moveRetract(dicer.maxX/2 + i * xoff, dicer.maxY/2 + yoff, h, 3 * s);
      dicer.moveExtrude(dicer.maxX/2 + i * xoff, dicer.maxY/2 + yoff, h + ov, 25, eAmount);
    }
    yoff += map(eAmount, 3, 9, 2.5, 4.2);
  }
  dicer.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  dicer.render();
}