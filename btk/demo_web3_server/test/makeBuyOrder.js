var redis = require('./redis');
var web3 = require('../src/web3/web3')

module.exports = function(callback) {
    var uid = 1001;
    redis.userTokens(uid, (err, rep) => {
        // var cateStr = web3.toBigNumber(rep[0]).toString(2)
        // var cate = parseInt(cateStr.substr(0, cateStr.length - 32), 2);
        // console.log(err, cate)
        redis.pushMethod({
            method: "makebuyorder",
            uid: uid + 1,
            price: '2',
            // cardId: cate
            cardId: 50111
        })
    })
}