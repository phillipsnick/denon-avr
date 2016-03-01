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
  this.queue = [];
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
  separator: false,
  timeout: 1500
}

/**
 * Default connect to server
 *
 * @param   function  callback
 */
transport.prototype.connect = function(callback) {
  this.connection.on('ready', function() {
    this.config.debug && console.log('denon.avr.telnet', 'socket "ready" state, call handleQueue');
    handleQueue(this);
  }.bind(this));
  this.connection.on('timeout', function() {
    this.config.debug && console.log('denon.avr.telnet', 'socket "timeout" state, call handleQueue');
    handleQueue(this);
  }.bind(this));
  this.connection.on('connect', function() {
    callback();
  });
  return this.connection.connect(this.config);
}

/**
 * Send a command, including standard \r carriage return
 *
 * @param   string    cmd
 * @param   function  callback
 */
transport.prototype.send = function(cmd, callback) {
  if (cmd === '' || cmd === null)
    return callback && callback(new Error('Empty command parameter'));
  this.queue.push({id: nextId(), cmd: cmd, callback: callback});
  this.queue.length === 1 && handleQueue(this);
}

/**
 * Get the telnet connection
 *
 * @return  object
 */
transport.prototype.getConnection = function() {
  return this.connection;
}

var lastSent = null;

function handleQueue(transport) {
  stopSendTimeout();
  var item = transport.queue[0];
  //If it's true, handleQueue being called twice for same queue state. For sure: it's send timeout. Call callback and schedule next handleQueue
  if (lastSent && item && lastSent.id === item.id)
    return item.callbackInner(new Error('Send timeout'), null);
  if (item !== null && item !== undefined) {
    transport.config.debug && console.log('denon.avr.telnet: sending item[%s]', JSON.stringify(item));
    item.callbackInner = buildCallbackInner(item, transport);
    lastSent = item;
    resetSendTimeout(transport);
    transport.connection.exec(item.cmd, item.callbackInner.bind(this));
  }
}

function buildCallbackInner(_item, _transport) {
  return function(item, transport) {
    return function(error, response) {
      transport.config.debug && console.log('denon.avr.telnet: callbackInner(%s, %s) for item[%s]', JSON.stringify(error), JSON.stringify(response), JSON.stringify(item));
      stopSendTimeout();
      if (item.callbackCalled)
        return false;
      item.callbackCalled = true;
      setImmediate(function() {
        handleQueue(transport);
      });
      if (lastSent && lastSent.id === item.id) {
        transport.config.debug && console.log('denon.avr.telnet: clearing lastSent');
        lastSent = null;
      }
      transport.queue.shift();
      item.callback && item.callback(error, response);
    }
  }(_item, _transport);
}

/*
 Not always telnet-client's socket fire timeout event, when there are no response after command sent
 That's why one startint timeout timer after each cmd sent.
 */
var sendTimeout;
function resetSendTimeout(transport) {
  sendTimeout = setTimeout(function() {
    handleQueue(transport);
  }, transport.config.timeout || 1500);
}
function stopSendTimeout() {
  clearTimeout(sendTimeout);
}

var id = 1;
function nextId() {
  id++;
  if (id > 65535)
    id = 1;
  return id;
}

module.exports = transport;
