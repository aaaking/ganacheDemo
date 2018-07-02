var web3 = require('../web3');
var utils = require('../utils/utils');
var cardUtils = require('../utils/card');
var cardWallet = require('../contracts/cardWallet');
var buyAgent = require('../contracts/buyAgent');
var redis = require('../redis/async');

var queue = [];
var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('takeBuyOrder', uid, code);
}

function takeBuyOrder(ops) {
    var uid = ops.uid;
    var to = buyAgent.addr;
    var token = cardUtils.cardToToken(ops.cardId, ops.cardCode);

    redis.getBuyOrder(ops.orderId, function(err, result) {
        if (err || !result) {
            notifyLuaError(uid, 1);
            console.error('no buy order: ' + ops.orderId);
        } else {
            utils.addressOfUser(uid, function(err, rep) {
                if (err || !rep) {
                    notifyLuaError(uid, 1);
                    console.error('no buy order: ' + ops.orderId);
                } else {
                    var from = rep[0];
                    if (!from) {
                        notifyLuaError(uid, 1);
                        return;
                    }
                    var orderId = web3.toBigNumber(ops.orderId).toString(16);
                    orderId = 'yoka' + orderId;

                    var order = JSON.parse(result);
                    cardWallet.transfer(from, to, token, orderId, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            utils.addressOfUser(order.uid, function(err, rep) {
                                if (err) {
                                } else {
                                    transactions[result] = {
                                        method: 'takeBuyOrder',
                                        uid: uid,
                                        maker: order.uid,
                                        taker: uid,
                                        price: ops.price,
                                        cardId: ops.cardId,
                                        cardCode: ops.cardCode,
                                        orderId: ops.orderId,
                                        token: token,
                                        makerAddr: rep[0],
                                        takerAddr: from
                                    };
                                }
                            });
                        }
                    });
                }
            });
        }
    })
}

buyAgent.addTakeOrderListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];
    var args = event.args;

    var fund = args._fund;
    transaction.fund = web3.fromWei(fund, 'ether').toString(10);

    if (transaction) {
        web3.eth.getBalance(transaction.takerAddr, function(err, result) {
            if (err) {
                console.error("get balance error address:" + transaction.takerAddr);
            } else {
                transaction.takerBalance = web3.fromWei(result, 'ether').toString(10);
                redis.takeBuyOrder(transaction);

                redis.notifyLua(transaction);
            }
        });

        delete transactions[hash];

        buyAgent.withdrawToken(transaction.makerAddr, token, function(err, hash) {
            if (err) {
                console.error(err);
            } else {
                transaction.method = 'cardBoughtNtf';
                transaction.uid = transaction.maker;
                transactions[hash] = transaction;
            }
        });
    }
})

buyAgent.addWithDrawListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];
    if (transaction) {
        var token = transaction.token;

        redis.addUserCard(transaction.maker, token);
        redis.notifyLua(transaction);
        
    }
});
module.exports = takeBuyOrder;