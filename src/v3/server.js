var port = parseInt(process.argv[2], 10);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: port});
var redis = require('redis');
var pub = redis.createClient();
var sub = redis.createClient();

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
    pub.publish('global', msg);
  });
});