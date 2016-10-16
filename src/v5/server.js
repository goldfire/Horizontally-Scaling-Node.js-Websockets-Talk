var port = parseInt(process.argv[2], 10);
var Primus = require('primus');
var primus = new Primus.createServer({port: port, transformer: 'websockets'});
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
    primus.write(JSON.parse(msg));
  }
});

primus.on('connection', function(ws) {
  console.log('CONNECTED', port);
  ws.on('data', function(msg) {
    msg.color = color;
    pub.publish('global', JSON.stringify(msg));
  });
});