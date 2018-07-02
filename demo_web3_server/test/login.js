var redis = require('./redis');

module.exports = function() {
    redis.pushMethod({
        method: "login",
        uid: '1001'
    })
}