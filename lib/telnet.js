function transport(config) {
  var telnet = require('telnet-client');

  this.config = config;
  this.connection = new telnet();
}


module.exports = transport;

transport.prototype.connect = function(callback) {
  this.connection.on('connect', function() {
    callback();
  });

  this.connection.connect(this.config);
}

transport.prototype.send = function(cmd, callback) {
  cmd = cmd + '\r';

  this.connection.exec(cmd, callback);
}