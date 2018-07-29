var web3 = require('../web3');
var utils = require('../utils/utils');
var cardWallet = require('../contracts/cardWallet');
var buyAgent = require('../contracts/buyAgent');
var redis = require('../redis/async');

var queue = [];
var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('makeBuyOrder', uid, code);
}

function makeBuyOrder(ops) {
    var uid = ops.uid;
    var price = ops.price;
    var token = parseInt(ops.cardId);
    if (!token) {
        return;
    }

    utils.addressOfUser(uid, function(err, rep) {
        if (err || !rep) {
            notifyLuaError(uid, 1);
        } else {
            var from = rep[0];
            if (!from) {
                notifyLuaError(uid, 1);
                return;
            }
            buyAgent.makeOrder(from, token, price, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    transactions[result] = {
                        uid: uid,
                        tokenCate: token,
                        price: price
                    }
                }
            });
        }
    });

}


buyAgent.addMakeOrderListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];

    if (transaction) {
        var uid = transaction.uid;
        var args = event.args;
        var orderId = args._order.toString();
        var price = web3.fromWei(args._price, 'ether');
        var tokenCate = transaction.tokenCate.toString();
        var blockNumber = event.blockNumber.toString();

        redis.addBuyOrder(uid, orderId, tokenCate, price, blockNumber);
        utils.updateUserBalance(uid);

        redis.notifyLua({
            method: "makeBuyOrder",
            uid: uid,
            orderId: orderId,
            price: price,
            cardId: tokenCate
        })        
    }
})
module.exports = makeBuyOrder;