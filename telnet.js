var telnet = require('telnet-client');
var connection = new telnet();

var params = {
  host: '10.0.10.11',
  port: 23,
 // shellPrompt: '/ # ',
  timeout: 1500
  // removeEcho: 4
};

connection.on('ready', function(prompt) {
  connection.exec('PW?', function(response) {
    console.log(response);
  });
});

connection.on('timeout', function() {
  console.log('socket timeout!')
  connection.end();
});

connection.on('close', function() {
  console.log('connection closed');
});

connection.connect(params);