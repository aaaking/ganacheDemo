var config = require('../../config');
var BlockRedis = require('./blockRedis');
var EventEmitter = require('events').EventEmitter;

var redis = new BlockRedis(config.redis_keys.Web3ReqKey);
var emitter = new EventEmitter();

function onRequest(key, value) {
    try {
        var reqJson = JSON.parse(value);
        if (reqJson.method) {
            var name = reqJson.method.toUpperCase();
            emitter.emit(name, reqJson);
        } else {
            console.log("redis request error " + key + " " + value);
        }
    } catch (error) {
        console.log(error);        
    }
}

function on(evetName, listener) {
    emitter.on(evetName.toUpperCase(), listener);
}

redis.listener = onRequest;

redis.poll();

process.on('SIGINT', function() {
    redis.blockClient.end(true);
    console.log('block redis quit');
})


module.exports = {
    on : on
}