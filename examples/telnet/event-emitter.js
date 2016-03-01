var denon = require('../../lib/app')
  , config = require('./config');

var avr = new denon(new denon.transports.telnet(config));

avr.connect();
avr.on('connect', function () {
  console.log('Connected');
});

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");

  avr.getConnection().destroy();
  process.exit(0);
});
