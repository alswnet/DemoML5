// console.log('ml5 version:', ml5.version);
var Camara;

function setup() {
  var ObtenerCanva = document.getElementById('micanva');
  var Ancho = ObtenerCanva.offsetWidth;
  var sketchCanvas = createCanvas(Ancho, 600);
  sketchCanvas.parent("micanva");
  Camara = createCapture(VIDEO);
  Camara.hide();
}

function draw() {

  image(Camara, 0, 0, width * Camara.width / Camara.height, width);

}

function windowResized() {
  var ObtenerCanva = document.getElementById('micanva');
  var Ancho = ObtenerCanva.offsetWidth;
  resizeCanvas(Ancho, 450);
}
