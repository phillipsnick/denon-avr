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
  if (state === true) {
    var cmd = 'PWON';
  } else {
    var cmd = 'PWSTANDBY';
  }
  this.connection.send(cmd, function(response) {

    console.log(response.split('\n'));
  });
}

/**
 *
 * @param   function  callback
 */
denon.prototype.getPowerState = function(callback) {
  this.connection.send('PW?', function(state) {
    switch(state) {
      case 'PWSTANDBY':
        callback(null, false);
        break;

      case 'PWON':
        callback(null, true);
        break;

      default:
        callback(new Error('Unable to get power state'));
    }
  });
}

denon.prototype.setVolumeUp = function(callback) {

}

denon.prototype.setVolumeDown = function(callback) {

}

denon.prototype.setVolumeLevel = function(level, callback) {

}

denon.prototype.getVolumeLevel = function(callback) {

}

denon.prototype.getTransport = function() {
  return this.connection
}

denon.prototype.getConnection = function() {
  return this.getTransport().connection;
}

module.exports = denon;