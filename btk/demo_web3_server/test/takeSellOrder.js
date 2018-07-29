var redis = require('./redis');

module.exports = function() {
    var uid = 1002;
    var cardId = 30301;
    var cardCode = 1;

    redis.pushMethod({
        method: "takeSellOrder",
        uid: uid,
        cardId: cardId,
        cardCode: cardCode
    })
}