var web3 = require('../web3');
var utils = require('../utils/utils');
var cardUtils = require('../utils/card');
var cardWallet = require('../contracts/cardWallet');
var sellAgent = require('../contracts/sellAgent');
var redis = require('../redis/async');

var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('cancelSellOrder', uid, code);
}

function cancelSellOrder(ops) {
    var uid = ops.uid;

    var cardId = '0x' + ops.cardId.toString(16) + '00000000';
    cardId = web3.toBigNumber(cardId);
    var token = cardId.plus(ops.cardCode).toString();

    console.log(token);
    redis.getSellOrder(token, function(err, order) {
        if(err || !order) {
            redis.notifyLua({
                uid: uid,
                token: token,
                method: "cancelSellOrder",
                error: "no order"
            })
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

                    sellAgent.cancelOrder(from, token, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            transactions[result] = {
                                canceller : uid,
                            };
                        }
                    });
                }
            });
        }
    });
}


sellAgent.addCancelOrderListener(function(event) {
    var hash = event.transactionHash;
    var transaction = transactions[hash];
    if (transaction) {
        var uid = transactions[hash].canceller;
        var args = event.args;
        var token = args._token.toString();
        var {cardId, cardCode} = cardUtils.tokenToCard(token);
        if (uid) {
            redis.notifyLua({
                method: "cancelSellOrder",
                uid: uid,
                cardId: cardId,
                cardCode: cardCode
            })        

            redis.removeSellOrder(token);
            redis.addUserCard(uid, token);
        }
    }
})
module.exports = cancelSellOrder;