var port = parseInt(process.argv[2], 10);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: port});
var redis = require('redis');
var pub = redis.createClient();
var sub = redis.createClient();
var color = 'blue';

switch (port) {
  case 2001:
    color = 'red';
    break;

  case 2002:
    color = 'green';
    break;

  case 2003:
    color = 'purple';
    break;
}

sub.subscribe('global');
sub.on('message', function(channel, msg) {
  if (channel === 'global') {
    wss.clients.forEach(function(client) {
      client.send(msg);
    });
  }
});

wss.on('connection', function(ws) {
  ws.on('message', function(msg) {
    msg = JSON.parse(msg);
    msg.color = color;
    pub.publish('global', JSON.stringify(msg));
  });
});