/**
 * Created by kycok on 16.02.2016.
 */
var denon = require('..');
var avr = new denon(new denon.transports.telnet({
    host: '192.168.2.113',     // IP address or hostname
    debug: true   // Debug enabled
}));
var power = null;
avr.on('connect', function () {
    console.log('Connected');
    setInterval(function () {
        console.log('PW?');
        //avr.send('PW?', 'PW', function (err, state) {
        //    if (err) {
        //        console.log(err);
        //        return;
        //    }
        //    console.log('The current power state is:', state);
        //}, 'Unable to get the power state');
        avr.getPowerState(function (err, state) {
            if (err) {
                console.log(err.toString());
                return;
            }
            console.log('The current power state is', state);
            power = (state == 'ON');
            togglePower();
        });
    }, 10000);
});
avr.connect();

function togglePower() {
    power = !power;
    avr.setPowerState(power, function (err) {
        if (err) {
            console.log(err.toString());
            return;
        }
    });
}