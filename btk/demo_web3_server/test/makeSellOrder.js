var redis = require('./redis');
var web3 = require('../src/web3/web3')

module.exports = function(callback) {
    var uid = 1001;
    redis.userTokens(uid, (err, rep) => {
        console.log(err, rep);

        if (rep.length == 0) {
            console.error("no cards");
            return;
        }
        var token = web3.toBigNumber(rep[0]).toString(2);
        console.log(token);
        var cardId = parseInt(token.substr(0, token.length - 32), 2);
        var cardCode = parseInt(token.slice(-32), 2);

        redis.pushMethod({
            method: "makesellorder",
            uid: uid,
            price: '2',
            cardId: cardId,
            cardCode: cardCode
        })
    })
}