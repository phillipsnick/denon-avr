# Denon Remote control

Denon AVR remote control via RS232 or IP (Telnet) supporting two way communication.


## Installation

```bash
npm install denon-avr
```

### RS232 Interface

This is currently a work in progress. See issue #1

__I accept no responsibility for any damage done to your computer or equipment.__


## Usage

### Via Telnet

The telnet transport needs to be passed onto the denon-avr module.

__Example__

```js
var denon = require('denon-avr');

var avr = new denon(new denon.transports.telnet({
  host: '',     // IP address or hostname
  debug: true   // Debug enabled
}));

avr.on('connect', function() {
  // now connected
  // all commands to be placed here
});
```

### Via RS232

__TODO__

__Example__

```js
var denon = require('denon-avr');
```


## Methods

A number of examples can be found within the [examples directory](https://github.com/phillipsnick/denon-avr/tree/master/examples).

### General

#### connect()

Connect via the provided transport.

Note, this method provides no callback, please see the 'connect' event.

__Example__

```js
avr.connect();
```

---------------------------------------

#### send(command, prefix, callback, error)

Generic send via provided transport aimed to reduce code duplication throughout the library.

__Arguments__

* `command` - String to be sent via the provided transport
* `prefix` - The expected response prefix either as a string (eg. 'MV) or a RegExp instance
* `callback(err, response)` - Callback function for error/response handling
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

---------------------------------------

#### parseData(data)

Parse the data received from an event on the AVR.

__TODO__

See issue #5

__Arguments__

* `data` - ??

__Example__

```js
avr.parseData(data);
```

---------------------------------------

#### parseResponse(data, prefix, callback, error);

Parse the response provided when sending a command, another simple method to reduce code duplication throughout the library, ideally this shouldn't be used outside of the library.

__Arguments__

* `data` - String received from the AVR
* `prefix` - The expected response prefix either as a string (eg. 'MV) or a RegExp instance
* `callback(err, response)` - Callback function for error/response handling
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

---------------------------------------

#### getTransport()

Get the transport object provided when creating the module.

__Example__

```js
var transport = avr.getTransport();
```

---------------------------------------

#### getConnection()

Get the connection created by the transport.

__Example__

```js
var connection = avr.getConnection();
```

---------------------------------------

#### parseAsciiVolume(volume, zero)

Parse the volume provided in ASCII format to dB as per the Denon documentation.

For example the master volume would be returned in ASCII as followed:

|ASCII Value|dB Value|
|-----------|--------|
|80|0dB|
|995|-80.5dB|

__Arguments__

* `volume` - ASCII value (eg 995 or 99)
* `zero` - Optional value to calculate the zero position. Defaults to 80 to support master volume, provide 50 if dealing with channel volumes

__Example__

```js
var volume = '995';

console.log(avr.parseAsciiVolume(volume));

// output: -80.5
```

---------------------------------------

#### parseDbVolume(volume, zero)

Parse a dB volume into ASCII format for sending back to the AVR.

__Arguments__

* `volume` - Numeric value containing the volume in dB (eg -80.5)
* `zero` - Optional value to calculate the zero position. Defaults to 80 to support master volume, provide 50 if dealing with channel volumes

__Example__

```js
var volume = -60.5;

console.log(avr.parseDbVolume(volume));

// output: 195
```


### AVR Specific

These are methods aimed at controlling or querying the AVRs specific functions.

All examples below assume a connection has been created to the AVR as per the examples within usage.

#### setPowerState(state, callback)

Set the power state of the AVR.

Note, that if you try to set the same state the AVR is currently, no response is returned.

__Arguments__

* `state` - bool, true to power on, false to power of
* `callback(err, volume)` - Callback on completion, `volume` to contain ASCII volume level

__Example__

Power on the AVR.

```js
avr.setPowerState(true, function(err, state) {
  if(err) {
    console.log(err);
    return;
  }
  
  console.log('The power state is now:', state);
});
```

---------------------------------------

#### getPowerState(callback)

Get the current power state.

__Arguments__

* `callback(err, state)` - Callback on completion, `state` to contain either ON/OFF

__Example__

```js
avr.getPowerState(function(err, state) {
  if(err) {
      console.log(err);
      return;
    }
    
    console.log('The power state is:', state);
});
```

---------------------------------------

#### setVolumeUp(callback)

Increase the master zone volume by 0.5dB.

__Arguments__

* `callback(err, volume)` - Callback on completion, `volume` to provide master zone volume in ASCII format

__Example__

```js
avr.setVolumeUp(function(err, volume) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The volume is now', volume, '/', avr.parseAsciiVolume(volume), 'dB');
});
```

---------------------------------------

#### setVolumeDown(callback)

Decrease the master zone volume by 0.5dB.

__Arguments__

* `callback(err, volume)` - Callback on completion, `volume` to provide master zone volume in ASCII format

__Example__

```js
avr.setVolumeDown(function(err, volume) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The volume is now', volume, '/', avr.parseAsciiVolume(volume), 'dB');
});
```

---------------------------------------

#### setVolumeAscii(volume, callback)

Set the master zone volume level using ASCII an value.

__Arguments__

* `volume` - Volume in ASCII format
* `callback(err, volume)` - Callback on completion, `volume` to provide master zone volume in ASCII format

__Example__

Set the volume to -80.0dB

```js
avr.setVolumeAscii('00', function(err, volume) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The volume is now', volume, '/', avr.parseAsciiVolume(volume), 'dB');
});
```

---------------------------------------

#### setVolumeDb(volume, callback)

Set the master zone volume level using dB values.

__Arguments__

* `volume` - Volume in ASCII format
* `callback(err, volume)` - Callback on completion, `volume` to provide master zone volume in ASCII format

__Example__

Set the volume to -80.5dB

```js
avr.setVolumeDb(-80.5, function(err, volume) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The volume is now', volume, '/', avr.parseAsciiVolume(volume), 'dB');
});
```

---------------------------------------

#### getVolumeLevel(callback)

Get the master zone volume level.

__Arguments__

* `callback(err, volume)` - Callback on completion, `volume` to provide master zone volume in ASCII format

__Example__

```js
avr.setVolumeAscii(function(err, volume) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The volume is', volume, '/', avr.parseAsciiVolume(volume), 'dB');
});
```

---------------------------------------

#### setMute(state, callback)

Set the master zone mute state.

Note, the callback may provide an error if you attempt to set the state to the current mute state.

__Arguments__

* `state` - bool to enable or disable mute state
* `callback(err, state)` - Callback on completion, `state` to provide new mute state as ON/OFF

__Example__

Enable mute

```js
avr.setMute(true, function(err, state) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The current mute state is', state);
});
```

---------------------------------------

#### getMuteState(callback)

Get the master volume mute state

__Arguments__

* `callback(err, state)` - Callback on completion, `state` to provide mute state as ON/OFF

__Example__

Enable mute

```js
avr.getMuteState(true, function(err, state) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The current mute state is', state);
});
```

---------------------------------------

#### getSource(callback)

Get the current master zone source.

Results returned directly from AVR in the following format:
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

__Arguments__

* `callback(err, source)` - Callback on completion, `source` to provide source name as above

__Example__

```js
avr.getSource(function(err, source) {
  if (err) {
    console.log(err.toString());
    return;
  }

  console.log('The current source is', source);
});
```


### Events

__TODO__

See issue #5 ...


## Notes

This has been written for control of my AVR 3311, assuming the commands should be the same between models.

The full breakdown of the API provided by Denon can be found at http://www.awe-europe.com/documents/Control%20Docs/Denon/Archive/AVR3311CI_AVR3311_991_PROTOCOL_V7.1.0.pdf


## Licence

[The MIT License (MIT)](https://github.com/phillipsnick/denon-avr/blob/master/LICENSE)
