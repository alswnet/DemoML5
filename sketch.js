// console.log('ml5 version:', ml5.version);
var Camara;
var CartaMensaje;
var BotonesEntrenar;
var knn;
var modelo;
var Clasificando = false;
var dato;

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

  var SalvarBoton = select("#SalvarBoton");
  SalvarBoton.mousePressed(GuardadNeurona);

  var CargarBoton = select("#CargarBoton");
  CargarBoton.mousePressed(CargarNeurona);

  var TexBoxBoton = select("#TextBoxBoton");
  TexBoxBoton.mousePressed(EntrenarTexBox);

  var LimpiarBoton = select("#LimpiarBoton");
  LimpiarBoton.mousePressed(LimpiarKnn);
}

function draw() {

  image(Camara, 0, 0, width * Camara.width / Camara.height, width);

  if (knn.getNumLabels() > 0 && !Clasificando) {
    setInterval(clasificar, 500);
    Clasificando = true;
  }

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
  var NombreBoton = this.elt.innerText;
  console.log("Entrenando con " + NombreBoton);
  EntrenarKnn(NombreBoton);
}

function EntrenarKnn(ObjetoEntrenar) {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
}


function clasificar() {
  if (Clasificando) {
    const Imagen = modelo.infer(Camara);
    knn.classify(Imagen, function(error, result) {
      if (error) {
        console.error();
      } else {

        Etiquetas = Object.keys(result.confidencesByLabel);
        Valores = Object.values(result.confidencesByLabel);
        var Indice = 0;

        for (var i = 0; i < Valores.length; i++) {
          if (Valores[i] > Valores[Indice]) {
            Indice = i;
          }
        }

        dato = result;
        CartaMensaje.innerText = Etiquetas[Indice] + " - " + (Math.ceil(Valores[Indice] * 100)) + "%";
      }
    })
  }
}

function EntrenarTexBox() {
  const Imagen = modelo.infer(Camara);
  var EtiquetaTextBox = select("#TextBox").value();
  knn.addExample(Imagen, EtiquetaTextBox);
}

function GuardadNeurona() {
  if (Clasificando) {
    console.log("Guardando la neurona");
    knn.save("NeuronaKNN");
  }
}

function CargarNeurona() {
  console.log("Cargando una Neurona");
  knn.load("./data/NeuronaKNN.json", function() {
    console.log("Neurona Cargada knn");
    CartaMensaje.innerText = "Neurona cargana de archivo";
  })
}

function LimpiarKnn() {
  console.log("Borrando Neuroona")
  knn.clearAllLabels();
  Clasificando = false;
  CartaMensaje.innerText = "Neurona Borrada";
  clearInterval(clasificar);
}
