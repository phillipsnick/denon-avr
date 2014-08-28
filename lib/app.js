var events = require('events');

/**
 * Create the controller class with the provided connection
 *
 * @param   object   transport
 */
function denon(transport) {
  this.transport = transport;
}

/**
 * Define the available transport
 *
 * @type    object
 */
denon.transports = {
  telnet: require('./telnet')
}

/**
 * Connect to the AVR via the defined transport
 *
 * @param   function  callback
 */
denon.prototype.connect = function(callback) {
  // setup the event emitters
  //TODO: no idea
  this.getTransport().getConnection().on('data', function(data) {
    console.log('rec data', data);
  });

  this.transport.connect(callback);
}

/**
 * Set the power state to either true/false
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

  this.transport.send(cmd, function(response) {
    // we split the response because there usually is two responses, due to the telnet client
    // this changes \r to \n
    // when powering on these responses will be PWON and ZNON
    // when powering off there will be a single response of PWSTANDBY

    console.log(response.split('\n'));
  });
}

/**
 * Get the current power state
 *
 * @param   function  callback
 */
denon.prototype.getPowerState = function(callback) {
  this.transport.send('PW?', function(response) {
    var state = response.pop();

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

/**
 * Increase the volume by 1
 *
 * @param   function  callback
 */
denon.prototype.setVolumeUp = function(callback) {

}

/**
 * Decrease the volume by 1
 *
 * @param   function  callback
 */
denon.prototype.setVolumeDown = function(callback) {

}

/**
 * Set the volume at a specific level (0-99)
 *
 * @param   int       level
 * @param   function  callback
 */
denon.prototype.setVolumeLevel = function(level, callback) {

}

/**
 * Get the current volume level
 *
 * @param   function  callback
 */
denon.prototype.getVolumeLevel = function(callback) {

}

/**
 * Set the mute state
 *
 * @param   bool      state
 * @param   function  callback
 */
denon.prototype.setMute = function(state, callback) {

}

/**
 * Get the current mute state
 *
 * @param   function  callback
 */
denon.prototype.getMuteState = function(callback) {

}

/**
 * Get the provided transport layer
 *
 * @return  object
 */
denon.prototype.getTransport = function() {
  return this.transport
}

/**
 * Get the connection created in the transport layer
 *
 * @return  object
 */
denon.prototype.getConnection = function() {
  return this.getTransport().getConnection();
}

module.exports = denon;