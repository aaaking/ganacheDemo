var redis = require('./redis');

module.exports = function() {

    redis.pushMethod({
        uid: 1001,
        method: 'cancelBuyOrder',
        price: 2,
        cardId: 40405,
        orderId: 1,
        cardCode: 1
    })
}