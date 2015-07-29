var godot = require('godot');
var emailReactor = require('./emailReactor');
var isDownReactor = require('./isDownReactor');

godot.createServer({
  type: 'tcp',
  reactors: [
    function (socket) {
      socket.
        pipe(godot.where('service', '*/heartbeat')).
        pipe(godot.expire(1000 * 60 *5)).
        pipe(emailReactor({subject: 'EXPIRY'}));
    },
    function (socket) {
      socket.
        pipe(godot.where('service', '*/heartbeat')).
        pipe(isDownReactor()).
        pipe(emailReactor({subject: 'SERVICE DOWN'})).
        pipe(new godot.console());
    }
  ]
}).listen(1337);
