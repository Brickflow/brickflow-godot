var util = require('util');
var ses = require('node-ses');
var ReadWriteStream = require('godot/lib/godot/common/read-write-stream');

var Email = module.exports = function Email(options) {
  if(!options) options = {};
  if (!(this instanceof Email)) { return new Email(options) }
  ReadWriteStream.call(this);

  this.auth = {
    key: 'key',
    secret: 'secret'
  };

  this.subject = options.subject || 'Brickflow error';
  this.interval = options.interval || 3 * 60 * 1000;
  this._last = 0;
  this.mailer = ses.createClient(this.auth);
  this.to = 'dev@brickflow.com';
};

util.inherits(Email, ReadWriteStream);

Email.prototype.write = function (data) {
  var text = JSON.stringify(data, null, 2),
      self = this;

  //
  // Return immediately if we have sent an email
  // in a time period less than `this.interval`.
  //
  if (this.interval && this._last
      && ((new Date()) - this._last) <= this.interval) {
    return;
  }

  this.mailer.sendemail({
    to:      this.to,
    from:    'godot@brickflow.com',
    subject: this.subject,
    message: 'Message: ' + text
  }, function (err) {
    self._last = new Date();

    return err
      ? self.emit('reactor:error', err)
      : self.emit('data', data);
  });
};
