// console.log('ml5 version:', ml5.version);
var Camara;
var CartaMensaje;
var BotonesEntrenar;
var knn;
var modelo;
var Clasificando = false;
var CargandoNeurona = false;
var RelacionCamara;

function setup() {
  var ObtenerCanva = document.getElementById('micanva');
  CartaMensaje = document.getElementById('CartaMensaje');
  CartaMensaje.innerText = "Cargando APP...";
  var AnchoCanvas = ObtenerCanva.offsetWidth;

  Camara = createCapture(VIDEO);
  // Camara.size(1280, 720);
  Camara.hide();
  RelacionCamara = Camara.height / Camara.width;
  var AltoCanvas = (AnchoCanvas * RelacionCamara);
  var sketchCanvas = createCanvas(AnchoCanvas, AltoCanvas);
  sketchCanvas.parent("micanva");

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
  background("#b2dfdb");

  image(Camara, 0, 0, width, height);

  if (knn.getNumLabels() > 0 && !Clasificando) {
    setInterval(clasificar, 500);
    Clasificando = true;
  }

  var RelacionCamara2 = Camara.height / Camara.width;
  if (RelacionCamara != RelacionCamara2) {
    var Ancho = width;
    var Alto = Ancho * RelacionCamara2;
    RelacionCamara = RelacionCamara2;
    console.log("Cambiando " + Ancho + " - " + Alto);
    resizeCanvas(Ancho, Alto, true);
  }
}

function windowResized() {
  var ObtenerCanva = document.getElementById('micanva');
  var Ancho = ObtenerCanva.offsetWidth;
  var Alto = Ancho * RelacionCamara;
  resizeCanvas(Ancho, Alto);
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
  var Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
}


function clasificar() {
  if (Clasificando) {
    var Imagen = modelo.infer(Camara);
    knn.classify(Imagen, function(error, result) {
      if (error) {
        console.log("Error en clasificar");
        console.error();
      } else {
        console.log(result);
        var Etiqueta;
        var Confianza;
        if (!CargandoNeurona) {
          Etiqueta = result.label;
          Confianza = Math.ceil(result.confidencesByLabel[result.label] * 100);
        } else {
          Etiquetas = Object.keys(result.confidencesByLabel);
          Valores = Object.values(result.confidencesByLabel);
          var Indice = 0;
          for (var i = 0; i < Valores.length; i++) {
            if (Valores[i] > Valores[Indice]) {
              Indice = i;
            }
          }
          Etiqueta = Etiquetas[Indice];
          Confianza = Math.ceil(Valores[Indice] * 100);
        }
        CartaMensaje.innerText = Etiqueta + " - " + Confianza + "%";
      }
    });
  }
}

function EntrenarTexBox() {
  var Imagen = modelo.infer(Camara);
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
    CargandoNeurona = true;
  });
}

function LimpiarKnn() {
  console.log("Borrando Neuroona");
  if (Clasificando) {
    Clasificando = false;
    clearInterval(clasificar);
    knn.clearAllLabels();
    CartaMensaje.innerText = "Neurona Borrada";
  }
}
