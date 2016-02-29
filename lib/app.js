var events = require('events')
    , util = require('util');

/**
 * Create the controller class with the provided connection
 *
 * @param   object   transport
 */
function denon(transport) {
    events.EventEmitter.call(this);

    this.transport = transport;
}

util.inherits(denon, events.EventEmitter);

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
 */
denon.prototype.connect = function () {
    var self = this;

    // setup the event emitters
    this.getTransport().getConnection().on('data', function (data) {
        self.parseData(data);
    });

    this.transport.connect(function () {
        self.emit('connect');
    });
}

/**
 * Set the power state to either true/false
 *
 * @param   bool      state
 * @param   function  callback
 */
denon.prototype.setPowerState = function (state, callback) {
    var cmd = 'PWSTANDBY';

    if (state) {
        cmd = 'PWON';
    }

    this.send(cmd, /PWON|PWSTANDBY|ZMON|ZMOFF/, callback, 'Unable to change power state, is the AVR already set to this state?');
}

/**
 * Get the current power state
 *
 * @param   function  callback
 */
denon.prototype.getPowerState = function (callback) {
    this.send('PW?', 'PW', callback, 'Unable to get current power state');
}

/**
 * Increase the volume by 0.5dB
 *
 * @param   function  callback
 */
denon.prototype.setVolumeUp = function (callback) {
    this.send('MVUP', new RegExp('[A-Z]{2}[0-9]{2,3}$'), function (err, volume) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, volume.substring(2));
    }, 'Unable to change the volume');
}

/**
 * Decrease the volume by 0.5dB
 *
 * @param   function  callback
 */
denon.prototype.setVolumeDown = function (callback) {
    this.send('MVDOWN', new RegExp('[A-Z]{2}[0-9]{2,3}$'), function (err, volume) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, volume.substring(2));
    }, 'Unable to change the volume');
}

/**
 * Set the volume at a specific level (0-99)
 *
 * @param   int       level
 * @param   function  callback
 */
denon.prototype.setVolumeAscii = function (level, callback) {
    this.send('MV' + level, new RegExp('[A-Z]{2}[0-9]{2,3}$'), function (err, volume) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, volume.substring(2));
    }, 'Unable to change the volume');
}

/**
 * Set the volume at a specific dB level (+1.0 to -80.5)
 *
 * @param   int       level
 * @param   function  callback
 */
denon.prototype.setVolumeDb = function (level, callback) {
    level = this.parseDbVolume(level);

    this.send('MV' + level, new RegExp('[A-Z]{2}[0-9]{2,3}$'), function (err, volume) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, volume.substring(2));
    }, 'Unable to change the volume');
}

/**
 * Get the current volume level
 *
 * @param   function  callback
 */
denon.prototype.getVolumeLevel = function (callback) {
    this.send('MV?', new RegExp('[A-Z]{2}[0-9]{2,3}$'), function (err, volume) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, volume.substring(2));
    }, 'Unable to get current volume');
}

/**
 * Set the mute state
 *
 * @param   bool      state
 * @param   function  callback
 */
denon.prototype.setMuteState = function (state, callback) {
    var cmd = 'MUOFF';

    if (state) {
        cmd = 'MUON';
    }

    this.send(cmd, 'MU', callback, 'Unable to change the mute status');
}

/**
 * Get the current mute state
 *
 * @param   function  callback
 */
denon.prototype.getMuteState = function (callback) {
    this.send('MU?', 'MU', callback, 'Unable to get the current mute status');
}

/**
 * Get the current source
 *
 * @param   function  callback
 */
denon.prototype.getSource = function (callback) {
    this.send('SI?', 'SI', callback, 'Unable to query current source');
}

/**
 * Send a command when we expect a single response
 *
 * @param   string    command   Command to be sent, eg MV?
 * @param   string    prefix    What the expected response will be prefixed with, eg MV for main volume
 * @param   function  callback  Callback to provide the response to with the prefix removed
 * @param   string    error     Error string to send to the callback
 */
denon.prototype.send = function(command, prefix, callback, error) {
  var self = this;
  this.transport.send(command, function(err, response) {
    if (err) {
      callback(err);
      return;
    }

    self.parseResponse(response, prefix, callback, error);
  });
}

/**
 * Parse a event received from the AVR not from sending a command
 *
 * @param   buffer    data
 */
denon.prototype.parseData = function (data) {
    //TODO:
}

/**
 * Parse the response when sending a command
 *
 * @param   string        data      Data returned from the transport
 * @param   string|RegExp prefix    What the expected response will be prefixed with, eg MV for main volume
 * @param   function      callback  Callback to provide the response to with the prefix removed
 * @param   string        error     Error string to send to the callback
 */
denon.prototype.parseResponse = function (data, prefix, callback, error) {
    if (typeof callback !== 'function') {
        return;
    }

    if (data instanceof Array !== true)
        data = [data];

    var responded = false;

    data.forEach(function (item) {
        if (prefix instanceof RegExp) {
            if (item.match(prefix)) {
                responded = true;
                callback(null, item);
            }
        } else {
            if (item.substring(0, prefix.length) === prefix) {
                responded = true;
                callback(null, item.substring(prefix.length));
            }
        }
    });

    if (responded === false) {
        callback(new Error(error));
    }
}

/**
 * Get the provided transport layer
 *
 * @return  object
 */
denon.prototype.getTransport = function () {
    return this.transport;
}

/**
 * Get the connection created in the transport layer
 *
 * @return  object
 */
denon.prototype.getConnection = function () {
    return this.getTransport().getConnection();
}

/**
 * Parse the volume to dB
 *
 * @param   string    volume   As per docs, 50=0db, 505 = -0.5dB
 * @return  double
 */
denon.prototype.parseAsciiVolume = function (volume, zero) {
    // if we havn't been provided with the 0dB value, assume it's 80
    // Master volume 80=0dB
    // Channel volume 50=0dB
    if (typeof zero === 'undefined') {
        zero = 80;
    }

    var halfdb = false;

    if (volume.length == 3) {
        halfdb = true;
        volume = volume.substring(0, 2);
    }

    volume = parseInt(volume) - zero;

    if (halfdb) {
        volume += 0.5;
    }

    return volume;
}

denon.prototype.parseDbVolume = function (volume, zero) {
    // if we havn't been provided with the 0dB value, assume it's 80
    // Master volume 80=0dB
    // Channel volume 50=0dB
    if (typeof zero === 'undefined') {
        zero = 80;
    }

    var halfdb = false;

    if (volume % 1 !== 0) {
        halfdb = true;
        volume = Math.floor(volume);
    }

    volume = (volume + zero).toString();

    if (halfdb) {
        volume += '5';
    }

    return volume;
}

module.exports = denon;
