// console.log('ml5 version:', ml5.version);
var Camara;
var CartaMensaje;
var BotonesEntrenar;
var knn;
var modelo;

function setup() {
  var ObtenerCanva = document.getElementById('micanva');
  CartaMensaje = document.getElementById('CartaMensaje');
  CartaMensaje.innerText = "Cargando APP...";
  var Ancho = ObtenerCanva.offsetWidth;
  var sketchCanvas = createCanvas(Ancho, 600);
  sketchCanvas.parent("micanva");
  Camara = createCapture(VIDEO);
  Camara.hide();

  modelo = ml5.featureExtractor('MobileNet', ModeloListo);
  knn = ml5.KNNClassifier();

  BotonesEntrenar = selectAll(".BotonEntrenar");

  for (var B = 0; B < BotonesEntrenar.length; B++) {
    BotonesEntrenar[B].mousePressed(PresionandoBoton);
  }

}

function draw() {

  image(Camara, 0, 0, width * Camara.width / Camara.height, width);

}

function windowResized() {
  var ObtenerCanva = document.getElementById('micanva');
  var Ancho = ObtenerCanva.offsetWidth;
  resizeCanvas(Ancho, 450);
}

function ModeloListo() {
  console.log("Modelo Listo");
  CartaMensaje.innerText = "Modelo Listo";
}

function PresionandoBoton() {
  var NombreBoton = this.elt.innerHTML;
  console.log("Entrenando con " + NombreBoton);
  EntrenarKnn(NombreBoton);
}

function EntrenarKnn(ObjetoEntrenar) {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
}

function LimpiarKnn() {
  knn.clearAllLabels();
}
