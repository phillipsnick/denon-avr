/**
 * Create the controller class with the provided connection
 *
 * @param   object   connection
 */
function denon(connection) {
  this.connection = connection;
}

/**
 * Define the available transport
 * @type {{telnet: exports}}
 */
denon.transport = {
  telnet: require('./telnet')
}

denon.prototype.connect = function(callback) {
  this.connection.connect(callback);
}

/**
 *
 * @param   bool      state
 * @param   function  callback
 */
denon.prototype.setPowerState = function(state, callback) {

}

/**
 *
 * @param   function  callback
 */
denon.prototype.getPowerState = function(callback) {

}

denon.prototype.setVolumeUp = function(callback) {

}

denon.prototype.setVolumeDown = function(callback) {

}

denon.prototype.setVolumeLevel = function(level, callback) {

}

denon.prototype.getVolumeLevel = function(callback) {

}

denon.prototype.getConnection = function() {
  return this.connection;
}

module.exports = denon;