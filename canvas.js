const canvas = new fabric.Canvas('canvas');
const ws = new WebSocket('ws://localhost:9020');

function enviarFigura(figura) {
  const figuraNueva = {"id" : figura.id, "type" : figura.type, "width" : figura.width, "height": figura.height, "top": figura.top, "left": figura.left, "fill": figura.fill, "scaleX": figura.scaleX, "scaleY": figura.scaleY}
  if (figura.radius !== undefined) {
    figuraNueva.radius = figura.radius;
  }
  const figuraJson = JSON.stringify(figuraNueva);
  ws.send(figuraJson);
}

function crearCirculo() {
  const circulo = new fabric.Circle({
    radius: 50,
    fill: 'red',
    left: 600,
    top: 250,
    id: uuidv4()
  });
  canvas.add(circulo);
  enviarFigura(circulo);
}

function crearTriangulo() {
  const triangulo = new fabric.Triangle({
    width: 100,
    height: 100,
    fill: 'green',
    left: 600,
    top: 250,
    id: uuidv4()
  });
  canvas.add(triangulo);
  enviarFigura(triangulo);
}

function crearCuadrado() {
  const cuadrado = new fabric.Rect({
    width: 100,
    height: 100,
    fill: 'blue',
    left: 600,
    top: 250,
    id: uuidv4()
  });
  canvas.add(cuadrado);
  enviarFigura(cuadrado);
}

ws.onmessage = function(event) {
  const figura = JSON.parse(event.data);
  if (figura.type === 'circle') {
    const circulo = new fabric.Circle(figura);
    canvas.add(circulo);
  } else if (figura.type === 'triangle') {
    const triangulo = new fabric.Triangle(figura);
    canvas.add(triangulo);
  } else if (figura.type === 'rect') {
    const cuadrado = new fabric.Rect(figura);
    canvas.add(cuadrado);
  } else if (figura.type === 'usuarios') {
    const usuariosConectadosElem = document.getElementById('clientesConectados');
    usuariosConectadosElem.innerText = `Usuarios: ${figura.count}`;
  } else if (figura.type === 'limpiar') {
    canvas.clear()
  } else if (figura.type === 'mover') {
    const object = canvas.getObjects();
    object.forEach(function(elemento) {
      console.log(elemento);
      if (elemento.id === figura.id) {
        elemento.top = figura.contenido.top;
        elemento.left = figura.contenido.left;
        canvas.renderAll();
      }
      
  });
  }
};

canvas.on('object:moving', function (e) {
  const mensaje = {"type" : "mover", "id": e.target.id, "contenido" : e.target.toJSON()};
  ws.send(JSON.stringify(mensaje));
});

function limpiarCanvas() {
  canvas.clear();
  ws.send(JSON.stringify({ type: 'limpiar' }));
}
