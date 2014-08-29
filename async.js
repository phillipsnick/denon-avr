var async = require('async');

var q = async.queue(function(task, callback) {
  task(callback);
}, 1);

q.drain = function() {
  console.log('all items have been processed');
}

q.push(function(callback) {
  console.log('first');

  setTimeout(function() {
    q.push(function(callback) {
      console.log('third');
      callback();
    });

    callback();
  }, 1500);
});

q.push(function(callback) {
  console.log('second');

  callback();
});

setTimeout(function() {
  q.push(function(callback) {
    console.log('forth');
    callback();
  })
}, 3000);


setInterval(function(){
  //console.log('Queue length:', q.length());
}, 1000);

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  process.exit(0);
});