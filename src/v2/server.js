var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 2000});

wss.on('connection', function(ws) {
  ws.on('message', function(msg) {
    wss.clients.forEach(function(client) {
      client.send(msg);
    });
  });
});