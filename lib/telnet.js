/**
 * Create the telnet transport
 *
 * @param   object    config
 */
function transport(config) {
  var telnet = require('telnet-client');

  this.config = config;
  this.connection = new telnet();
}

/**
 * Default connect to server
 *
 * @param   function  callback
 */
transport.prototype.connect = function(callback) {
  this.connection.on('connect', function() {
    callback();
  });

  this.connection.connect(this.config);
}

/**
 * Send a command, including standard \r carriage return
 *
 * @param   string    cmd
 * @param   function  callback
 */
transport.prototype.send = function(cmd, callback) {
  cmd = cmd + '\r';

  this.connection.exec(cmd, callback);
}

/**
 * Get the telnet connection
 *
 * @return  object
 */
transport.prototype.getConnection = function() {
  return this.connection;
}

module.exports = transport;