# Denon Remote control

Denon AVR remote control via RS232 or IP (Telnet) supporting two way communication


## RS232 Interface

This is currently a work in progress. See issue #1

__I accept no responsibility for any damage done to your computer or equipment__


## Installation

```
npm install denon-avr
```


## Usage

### Via Telnet

```javascript
var denon = require('denon-avr');

var avr = new denon(new denon.transports.telnet({
  host: '' // IP address or hostname
}));

avr.connect(function() {
  // now connected
});
```


### Methods

...


### Events

...


## Notes

This has been written for control of my AVR 3311, assuming the commands should be the same between models.

The full breakdown of the API provided by Denon can be found at http://www.awe-europe.com/documents/Control%20Docs/Denon/Archive/AVR3311CI_AVR3311_991_PROTOCOL_V7.1.0.pdf


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/denon-avr/blob/master/LICENSE)
