/**
 * Create the telnet transport
 *
 * @param   object    config
 */
function transport(config) {
  var telnet = require('telnet-client');

  for(var key in config) {
    this.config[key] = config[key];
  }

  this.connection = new telnet();
}

/**
 * Define the default config for a Denon AVR
 *
 * @type  object
 */
transport.prototype.config = {
  shellPrompt: '',
  echoLines: 0,
  irs: '\r',
  ors: '\r',
  seperator: '\n',
  execTimeout: 200
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