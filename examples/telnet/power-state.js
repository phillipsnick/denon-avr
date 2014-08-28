var denon = require('../../lib/app')
  , config = require('./config');

var avr = new denon(new denon.transports.telnet(config));

avr.connect(function() {
  console.log('Connected');
  avr.getPowerState(function(err, state) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log('The current power state is', state ? 'ON' : 'OFF');
  });
});

// close the connection and node process after 2 seconds
setTimeout(function() {
  avr.getConnection().destroy();
  process.exit(0);
}, 2000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");

  avr.getConnection().destroy();
  process.exit(0);
});