var config = require('../config');
var keyConf = config.redis_keys;
var redis = require('redis');

var client = redis.createClient(config.redis);

function pushMethod(ops) {
    client.lpush(config.redis_keys.Web3ReqKey, JSON.stringify(ops));
}

function userTokens(uid, callback) {
    client.smembers(keyConf.UserTokens + uid, callback);
}

function stop() {
    client.quit();
}

module.exports = {
    stop : stop,
    pushMethod: pushMethod,
    userTokens: userTokens
}