var web3 = require('../web3');
var utils = require('../utils/utils');
var cardWallet = require('../contracts/cardWallet');
var buyAgent = require('../contracts/buyAgent');
var redis = require('../redis/async');

var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('cancelBuyOrder', uid, code);
}

function cancelBuyOrder(ops) {
    var uid = ops.uid;
    var orderId = ops.orderId;

    redis.getBuyOrder(orderId, function(err, order) {
        if(err) {
            notifyLuaError(uid, 1);
        } else {
            order = JSON.parse(order);
            utils.addressOfUser(uid, function(err, rep) {
                if (err || !rep) {
                    notifyLuaError(uid, 1);
                } else {
                    var from = rep[0];
                    if (!from) {
                        notifyLuaError(uid, 1);
                        return;
                    }

                    buyAgent.cancelOrder(from, order.orderId, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            transactions[result] = {
                                canceller : uid,
                                cardId: order.cardId
                            };
                        }
                    });
                }
            })
        }
    });
}


buyAgent.addCancelOrderListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];
    if (transaction) {
        var uid = transactions[hash].canceller;
        var args = event.args;
        var orderId = args._order.toString();
        if (uid) {
            redis.notifyLua({
                method: "cancelBuyOrder",
                uid: uid,
                orderId: orderId,
                cardId: transaction.cardId
            })        

            redis.removeBuyOrder(orderId);
            utils.updateUserBalance(uid);

        }
    }
})
module.exports = cancelBuyOrder;