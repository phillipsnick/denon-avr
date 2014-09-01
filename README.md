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

```js
var denon = require('denon-avr');

var avr = new denon(new denon.transports.telnet({
  host: '',     // IP address or hostname
  debug: true   // Debug enabled
}));

avr.on('connect', function() {
  // now connected
});
```


## Methods

### General

#### connect - Connect via the provided transport

```js
avr.connect();
```

This method provides no callback, please see the 'connect' event.


#### send - Generic send via provided transport

```js
avr.send(command, prefix, callback, error);
```

Simple method to reduce code duplication throughout the library.

__Arguments__

* `command` - String to be sent via the provided transport
* `prefix` - The expected response prefix
* `callback(err, secondParam)` - Callback function for error/response handling
* `error` - Error string provided to the callback

__Example__

The below example would return the power state of the AVR.

```js
avr.send('PW?', 'PW', function(err, state) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('The current power state is:', state);
}, 'Unable to get the power state');
```


#### parseData - Parse the data received from an event on the AVR

__TODO__

```js
avr.parseData(data);
```


#### parseResponse - Parse the response provided when sending a command

```js
avr.parseResponse(data, prefix, callback, error);
```

Another simple method to reduce code duplication throughout the library, ideally this shouldn't be used outside of the library.

__Arguments__

* `data` - String received from the AVR
* `prefix` - The expected response prefix
* `callback(err, secondParam)` - Callback function for error/response handling
* `error` - Error string provided to the callback

__Example__

The below example would return the power state of the AVR.

```js
var callback = function(err, state) {
  if (err) {
    console.log(err);
    return;
  }
  
  console.log('The current power state is:', state);
}

avr.transport.send('PW?', function(err, response) {
  if (err) {
    callback(err);
    return;
  }

  avr.parseResponse(response, prefix, callback, error);
});
```


#### getTransport - Get the transport object provided when creating the module

```js
avr.getTransport();
```

__Example__

```js
var transport = avr.getTransport();
```


#### getConnection - Get the connection created by the transport

```js
avr.getConnection();
```

__Example__

```js
var connection = avr.getConnection();
```


#### parseAsciiVolume - Parse the volume provided in ASCII format to dB

This converts the ASCII value from the Denon AVR to a usable dB format. 

For example the master volume would be returned in ASCII as followed:

|ASCII Value|dB Value|
|80|0dB|
|995|-80.5dB|

__Example__

```js
var volume = '995';

console.log(avr.parseAsciiVolume(volume));

// output: -80.5
```


#### parseDbVolume - Parse a dB volume into ASCII format for sending back to the AVR

Convert an dB value back into ASCII.

__Example__

```js
var volume = -60.5;

console.log(avr.parseDbVolume(volume));

// output: 195


### AVR Specific

These are methods aimed at controlling or querying the AVRs specific functions.


#### setPowerState - Set the power state of the AVR

```js
avr.setPowerState(bool, function(err, state) {});
```

The state variable will be 'ON' or 'OFF'


#### getPowerState - Get the current power state

```js
avr.getPowerState(function(err, state) {});
```

The state variable will be 'ON' or 'OFF'


#### setVolumeUp - Increase the master volume by 0.5dB

```js
avr.setVolumeUp(function(err, volume) {});
```

The volume variable will be the new volume level in ASCII as per Denon documentation.


#### setVolumeDown - Decrease the master volume by 0.5dB

```js
avr.setVolumeDown(function(err, volume) {});
```

The volume variable inside the callback will be the new volume level in ASCII as per Denon documentation.


#### setVolumeAscii - Set the master volume level using ASCII values

```js
avr.setVolumeAscii(volume, function(err, volume) {});
```

The volume variable inside the callback will be the new volume level in ASCII as per Denon documentation.


#### setVolumeDb - Set the master volume level using dB values

````js
avr.setVolumeDb(volume, function(err, volume( {});


#### getVolumeLevel - Get the master volume level

```js
avr.getVolumeLevel(function(err, volume) {});
```

The volume variable inside the callback will be the new volume level in ASCII as per Denon documentation.


#### setMute - Set the master volume mute state

```js
avr.setMuteState(bool, function(err, state) {});
```

The state variable will be 'ON' or 'OFF'


#### getMuteState - Get the master volume mute state

```js
avr.getMuteState(function(err, state) {});
```

The state variable will be 'ON' or 'OFF'


#### getSource - Get the current source

```js
avr.getSource(function(err, source) {});
```

The callback source variable contains the current source name.

* PHONO
* CD
* TUNER
* DVD
* BD
* TV
* SAT/CBL
* DVR
* GAME
* V.AUX
* DOCK
* HDRADIO (AVR-3311-CI model Only)
* IPOD
* NET/USB
* FLICKR
* FAVORITES
* IRADIO
* SERVER
* USB/IPOD


### Events

...


## Notes

This has been written for control of my AVR 3311, assuming the commands should be the same between models.

The full breakdown of the API provided by Denon can be found at http://www.awe-europe.com/documents/Control%20Docs/Denon/Archive/AVR3311CI_AVR3311_991_PROTOCOL_V7.1.0.pdf


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/denon-avr/blob/master/LICENSE)
