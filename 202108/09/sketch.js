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
  let l = 20;

  let h = startHeight; // for 2d tests
  dicer.moveRetract(x, y, startHeight); // move to start

  for (let h = startHeight; h < startHeight + l; h += ov){
    for (let i = x; i < x + l; i += oh){
      for (let j = y; j < y + l; j += oh){
          dicer.moveRetract(i, j, h, 3 * s);
          dicer.moveExtrude(i, j, h + ov, 25, 5);
        }
      }
    }
  // for (let h = startHeight; h <= 5; h += o) { 
  //   // dots
  //   dicer.moveExtrude(x, y, h + o, 25, 5); // move slowly and extrude lots of filament on the dots
  //   dicer.moveRetract(x + l, y, h, 3 * s); // move quickly from point to point to reduce stringing
  //   dicer.moveExtrude(x + l, y, h + o, 25, 5);
  //   dicer.moveRetract(x + l, y + l, h, 3 * s);
  //   dicer.moveExtrude(x + l, y + l, h + o, 25, 5);
  //   dicer.moveRetract(x, y + l, h, 3 * s);
  //   dicer.moveExtrude(x, y + l, h + o, 25, 5);

  //   dicer.moveRetract(x, y, h + o, s);
  // }

  dicer.presentPart(); // pop the bed out. 
}

function draw() {
  orbitControl(2, 2, 0.1);
  background(255);
  dicer.render();
}