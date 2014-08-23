function setup(config) {
  var telnet = require('telnet-client');

  this.config = config;
  this.connection = new telnet();
}


module.exports = setup;

setup.prototype.connect = function(callback) {
  console.log('connecting');
  this.connection.on('ready', function() {
    console.log('ready');
    callback();
  });

  this.connection.connect(this.config);
}