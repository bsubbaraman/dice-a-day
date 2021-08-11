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
  // dicer.setTemps(200, 55);
  dicer.introLine(); // line back and forth to clean nozzle

  let startHeight = 0.2;
  let ov = 2; // vertical offset
  let oh = 3; // horizontal offset
  let s = 2500;
  let x = 100;
  let y = 100;
  let maxR = 15;

  let h = startHeight; // for 2d tests
  let eAmount = 3;

  let r = 2.4/2; // or in general, map(i, 3, 9, 2.4, 4.2); (mesasured empirically)
  let cosTheta = (pow(maxR, 2) - 2 * pow(r, 2)) / (pow(maxR, 2)); // law of cosines!
  let step = acos( cosTheta );
  console.log(step);

  for (let ring = 3; ring <= 9; ring++) {
    eAmount = ring;
    r = map(eAmount, 3, 9, 2.4, 4.2) / 2;
    cosTheta = (pow(maxR, 2) - 2 * pow(r, 2)) / (pow(maxR, 2)); // law of cosines!
    step = acos( cosTheta );

    if (ring > 3) {
      maxR -= r; // new ring is smaller by radius of new dot
    }
    
    for (let a = 0; a <= TWO_PI; a += step) {
      dicer.moveRetract(x + maxR * cos(a), y + maxR * sin(a), h, 3*s);
      dicer.moveExtrude(x + maxR * cos(a), y + maxR * sin(a), h + ov, 25, eAmount);
    }
  }


  dicer.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  dicer.render();
}