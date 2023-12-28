const WebSocket = require('ws');
const fabric = require('fabric');
const wss = new WebSocket.Server({ port: 9020 });
const figurasDibujadas = [];

let usuariosConectados = 0;

  function broadcast(message) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (client != wss) {
          client.send(message);
        }
      }
    });
  }

  wss.on('connection', function connection(ws) {
  usuariosConectados++;
  broadcast(JSON.stringify({ type: 'usuarios', count: usuariosConectados }));
  figurasDibujadas.forEach(function (objeto) {
    ws.send(JSON.stringify(objeto));
  });

  ws.on('message', function incoming(message) {
    const figura = JSON.parse(message);
    if (figura.type === 'limpiar') {
      figurasDibujadas.length = 0;
    } else {
      if (figura.type === 'mover') {
        figurasDibujadas.forEach(function (objeto) {
          if (objeto.id === figura.id) {
            objeto.left = figura.contenido.left;
            objeto.top = figura.contenido.top;
            const moverJSON = JSON.stringify({ type: 'mover', left: objeto.left, top: objeto.top, id: objeto.id });
            broadcast(moverJSON);
          }
        });
      } else {
        figurasDibujadas.push(figura);
      }
    }
    broadcast(JSON.stringify(figura));
  });

  ws.on('close', function close() {
    usuariosConectados--;
    broadcast(JSON.stringify({ type: 'usuarios', count: usuariosConectados }));
  });
});

