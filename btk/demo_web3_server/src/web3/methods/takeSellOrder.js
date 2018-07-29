var web3 = require('../web3');
var utils = require('../utils/utils');
var cardUtils = require('../utils/card');
var cardWallet = require('../contracts/cardWallet');
var sellAgent = require('../contracts/sellAgent');
var redis = require('../redis/async');

var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('takeSellOrder', uid, code);
}

function takeSellOrder(ops) {
    var uid = ops.uid;
    var token = cardUtils.cardToToken(ops.cardId, ops.cardCode);

    redis.getSellOrder(token, function(err, order) {
        if(err || !order) {
            redis.notifyLua({
                uid: uid,
                token: token,
                method: "takeSellOrder",
                error: "no order"
            })
        } else {
            utils.addressOfUser(uid, function(err, rep) {
                if (err || !rep) {
                    notifyLuaError(uid, 1);
                } else {
                    var from = rep[0];
                    if (!from) {
                        notifyLuaError(uid, 1);
                        return;
                    }
                    order = JSON.parse(order);

                    sellAgent.takeOrder(from, token, order.price, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            utils.addressOfUser(order.uid, function(err, rep) {
                                if (!err) {
                                    transactions[result] = {
                                        method: 'takeSellOrder',
                                        uid: uid,
                                        taker : uid,
                                        maker: order.uid,
                                        price: order.price,
                                        token: token,
                                        cardId: ops.cardId,
                                        cardCode: ops.cardCode,
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
    });
}


sellAgent.addTakeOrderListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];

    delete transactions[hash];

    if (transaction) {
        web3.eth.getBalance(transaction.takerAddr, function(err, result) {
            if (err) {
                console.error("get balance error address:" + transaction.takerAddr);
            } else {
                transaction.takerBalance = web3.fromWei(result, 'ether').toString(10);
                redis.takeSellOrder(transaction);

                redis.notifyLua(transaction);
            }
        });

        sellAgent.withdraw(transaction.makerAddr, function(err, hash) {
            if (err) {
                console.error(err);
            } else {
                transaction.method = 'cardSelledNtf';
                transaction.uid = transaction.maker;
                transactions[hash] = transaction;
            }
        })
    }
})

sellAgent.addWithDrawListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];
    var fund = web3.fromWei(event.args._fund, 'ether').toString(10);

    if (transaction) {
        var maker = transaction.maker;
        transaction.fund = fund;

        utils.updateUserBalance(maker);
        redis.notifyLua(transaction);
    }
});

module.exports = takeSellOrder;