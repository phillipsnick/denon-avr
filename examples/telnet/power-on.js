var denon = require('../../lib/app')
  , config = require('./config');

var avr = new denon(new denon.transport.telnet(config));

avr.connect(function() {
  console.log('Connected');
  avr.setPowerState(true, function(err, state) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log('The current power state is', state);
  });
});

setTimeout(function() {
  avr.getConnection().destroy();
  process.exit(0);
}, 2000);
