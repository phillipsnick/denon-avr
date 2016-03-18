var denon = require('../../lib/app')
  , config = require('./config');

var avr = new denon(new denon.transports.telnet(config));

avr.connect();
avr.on('connect', function() {
  console.log('Connected');

  avr.setMuteState(false, function(err, state) {
    if (err) {
      console.log('1:', err.toString());
      return;
    }

    console.log('1: The current mute state is', state);
  });
  avr.setMuteState(false, function(err, state) {
    if (err) {
      console.log('2:', err.toString());
      return;
    }

    console.log('2: The current mute state is', state);
  });
  avr.setMuteState(true, function(err, state) {
    if (err) {
      console.log('3:', err.toString());
      return;
    }

    console.log('3: The current mute state is', state);
  });
  avr.setMuteState(true, function(err, state) {
    if (err) {
      console.log('4:', err.toString());
      return;
    }

    console.log('4: The current mute state is', state);
  });
});

// close the connection and node process after 10 seconds
setTimeout(function() {
  avr.getConnection().destroy();
  process.exit(0);
}, 10000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");

  avr.getConnection().destroy();
  process.exit(0);
});
