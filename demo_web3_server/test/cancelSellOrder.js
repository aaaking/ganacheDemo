
var redis = require('./redis');

module.exports = function() {

    redis.pushMethod({
        uid: 1001,
        method: 'cancelSellOrder',
        price: 2,
        cardId: 30401,
        orderId: 0,
        cardCode: 1
    })
}