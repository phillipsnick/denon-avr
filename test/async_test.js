/**
 * Created by kycok on 17.02.2016.
 */
// create a queue object with concurrency 2
var async = require('async');
var q = async.queue(function (task, callback) {
    console.log('hello ' + task.name);
    task.func(callback);
}, 1);


// assign a callback
q.drain = function() {
    console.log('all items have been processed');
}
q.saturated = function() {
    console.log('queue is full of stars!');
}

// add some items to the queue

q.push({name: 'foo', func: function(next){next();}}, function (err) {
    console.log('finished processing foo');
});
q.push({name: 'bar', func: function(next){next();}}, function (err) {
    console.log('finished processing bar');
});

// add some items to the queue (batch-wise)

q.push([{name: 'baz', func: function(next){next();}},{name: 'bay', func: function(next){next();}},{name: 'bax', func: function(next){next()}}], function (err) {
    console.log('finished processing item');
});

// add some items to the front of the queue

q.unshift({name: 'bar', func: function(next){next();}}, function (err) {
    console.log('finished processing bar');
});