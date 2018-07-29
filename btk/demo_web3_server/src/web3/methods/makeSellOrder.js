var web3 = require('../web3');
var utils = require('../utils/utils');
var cardWallet = require('../contracts/cardWallet');
var sellAgent = require('../contracts/sellAgent');
var redis = require('../redis/async');

var queue = [];
var transactions = {};

function notifyLuaError(uid, code) {
    redis.notifyLuaError('makeSellOrder', uid, code);
}

function makeSellOrder(ops) {
    var uid = ops.uid;
    var to = sellAgent.addr;
    var price = web3.toBigNumber(web3.toWei(ops.price, 'ether')).toString(16);
    price = 'yoka' + price;
    
    var cardId = '0x' + ops.cardId.toString(16) + '00000000';
    cardId = web3.toBigNumber(cardId);
    var token = cardId.plus(ops.cardCode).toString();

    utils.addressOfUser(uid, function(err, rep) {
        if (err || !rep) {
            notifyLuaError(uid, 1);
        } else {
            var from = rep[0];
            if (!from) {
                notifyLuaError(uid, 1);
                return;
            }

            cardWallet.transfer(from, to, token, price, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    transactions[result] = uid;
                }
            });
        }
    });
}


sellAgent.addMakeOrderListener(function(event) {
    var hash = event.transactionHash;
    var uid = transactions[hash];
    var args = event.args;
    var token = args._token.toString(10);
    var price = web3.fromWei(args._price, 'ether').toString(10);
    var blockNumber = event.blockNumber.toString();
    if (uid) {
        redis.notifyLua({
            method: "makeSellOrder",
            uid: uid,
            token: token,
            price: price
        });
        
        redis.addSellOrder(uid, token, price, blockNumber);

        redis.removeUserCard(uid, token);
    }
})
module.exports = makeSellOrder;