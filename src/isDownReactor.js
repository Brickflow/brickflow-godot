var util = require('util');
var ReadWriteStream = require('godot/lib/godot/common/read-write-stream');

var IsDownReactor = module.exports = function IsDownReactor() {
  if (!(this instanceof IsDownReactor)) { return new IsDownReactor() }
  ReadWriteStream.call(this);
};

util.inherits(IsDownReactor, ReadWriteStream);

IsDownReactor.prototype.write = function (data) {
  if(data.meta.status !== 'ok'){
    this.emit('data', data);
  } else {
    return;
  }
};
