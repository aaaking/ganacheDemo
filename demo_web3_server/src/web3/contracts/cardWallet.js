var web3 = require('../web3')
var data = require('./config/CardOwnership.json')
var config = AppConfig.web3;

var addr = data.networks[config.networks].address
var contract = web3.eth.contract(data.abi).at(addr);

function onTransfer(err, event) {
    if (err) {
        console.log(err);
    } else {
        console.log(event);
    }
}

function onApproval(callback) {

}

function onApprovalForAll(callback) {

}

var cardWallet = {
    addr: addr,

    transfer : function(from, to, token, data, callback) {
        contract.safeTransferFrom.sendTransaction(from, to, token, data, {from: from, gas:999999}, (err, result) => {
            if(err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

    },

    balanceOf: function(address, callback) {
        contract.balanceOf(address, callback);
    },

    tokensOfOwner: function(address, balance, callback) {
        let tokens = arguments[3] || []
        
        if (balance <= 0) {
            callback(null, tokens);
        } else {
            let i = arguments[4] || 0;
            let cnt = 50;

            let len = Math.min(cnt, balance - i * cnt);

            var batch = web3.createBatch();
            for(let j = 0; j < len; j++) {
                let n = i * cnt + j;
                var request = contract.tokenOfOwnerByIndex.request(address, n, (err, token) => {
                    if (err) {
                        callback(err);
                    } else {
                        tokens[n] = token.toString();
                        if (tokens.length == balance) {
                            callback(null, tokens);
                        } else if (tokens.length == (i + 1) * cnt) {
                            cardWallet.tokensOfOwner(address, balance, callback, tokens, i+1);
                        }
                    }
                });
                request.params.push('latest');
                batch.add(request);
            }
            batch.execute();
        }
    }
}

module.exports = cardWallet;
