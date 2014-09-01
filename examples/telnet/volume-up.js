var denon = require('../../lib/app')
  , config = require('./config');

var avr = new denon(new denon.transports.telnet(config));

avr.connect();
avr.on('connect', function() {
  console.log('Connected');
  avr.setVolumeUp(function(err, volume) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log('The volume is', volume, '/', avr.parseAsciiVolume(volume), 'dB');
  });
});

setTimeout(function() {
  avr.getConnection().destroy();
  process.exit(0);
}, 2000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");

  avr.getConnection().destroy();
  process.exit(0);
});