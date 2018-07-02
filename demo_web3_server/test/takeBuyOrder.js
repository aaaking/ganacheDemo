var redis = require('./redis');

module.exports = function() {
    var uid = 1002;
    var cardId = 40405;
    var cardCode = 1;
    var orderId = 2;

    redis.pushMethod({
        method: "takeBuyOrder",
        uid: uid,
        cardId: cardId,
        cardCode: cardCode,
        orderId: orderId
    })
}