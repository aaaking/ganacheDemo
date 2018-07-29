var btkMergeCtrl = require('../contracts/btkMergeCtrl');
var redis = require('../redis/async');
var utils = require('../utils/utils');
var cardUtils = require('../utils/card');
var web3 = require('../web3')

var transactions = {}

var name = 'DoCompoundRep'

function notifyLuaError(uid, code) {
    redis.notifyLuaError(name, uid, code);
}

function onMergeCard(event) {
    var transaction = transactions[event.transactionHash]
    if (transaction) {
        web3.eth.getBalance(transaction.address, function(err, result) {
            if (err) {
                console.error('get user balance error' + err.toString());
                result = 0;
            }
            var token = event.args.merged.toString();
            var uid = transaction.uid;

            var cards = event.args.cards;
            var tokens = [];
            for(let i = 0; i < cards.length; i++) {
                tokens.push(cards[i].toString(10));
            }
            redis.compounded(uid, token, tokens, result.toString());

            var card = cardUtils.tokenToCard(token);
            redis.notifyLua({
                uid: uid,
                method: name,
                card: card
            });
        });
    }
}

function doCompound(ops) {
    var uid = ops.uid;
    utils.addressOfUser(uid, function(err, rep) {
        if (err) {
            notifyLuaError(uid, 1);
            return;
        }

        var address = rep[0];
        if (!address) {
            notifyLuaError(uid, 2);            
            return;
        }

        var cards = [];
        var c;
        for(let i = 0; i < ops.resId.length; i++){
            c = ops.resId[i];
            cards.push(cardUtils.cardToToken(c.cardId, c.cardCode));
        }

        btkMergeCtrl.mergeCard(address, ops.target, cards,  function(err, transactionHash) {
            if (err) {
                notifyLuaError(uid, 3);            
                console.log(err);
            } else {
                console.log(transactionHash);
                transactions[transactionHash] = {
                    uid: uid,
                    address: address
                }
            }
        })
    })
}

btkMergeCtrl.addMergeListener(onMergeCard);

module.exports = doCompound;