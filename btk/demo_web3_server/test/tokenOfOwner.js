var redis = require('./redis');

module.exports = function(callback) {
    redis.pushMethod({
        method: "tokensOfOwner",
        uid: '1000'
    })
}