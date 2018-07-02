var redis = require('../redis/async');
var web3 = require('../web3');
var data = require('./config/BTKMergeCtrl.json');
var config = AppConfig.web3;

var EventEmitter = require('events').EventEmitter;
var EventManager = require('../utils/EventManager');

var MERGE_CARD_EVENT = 'merge_card';
var emitter = new EventEmitter();

var BTKMergeCtrl = function() {
    this.addr = data.networks[config.networks].address
    this.contract = web3.eth.contract(data.abi).at(this.addr);
    this.mergeMgr = new EventManager();
}

BTKMergeCtrl.prototype.initMergeInfo = function() {
    let event = this.contract.MergeCard(null, {fromBlock: 0});

    event.get(function(err, events) {
        if(err) {
            console.error("init merge info error " + err);
        } else {
            redis.removeAllCompound((err) => {
                if (err) {
                    console.error("remove compound keys error " + err);
                } else {
                    events.forEach(e => {
                        let args = e.args;
                        let merged = args.merged.toString();
                        let cards = args.cards;
                        let tokens = [];
                        cards.forEach(c => {
                            tokens.push(c.toString());
                        });
                        redis.addCompound(merged, tokens);
                    });
                }

            })
        }
    })
}

BTKMergeCtrl.prototype.onMergeCard = function(err, event) {
    if (err) {
        console.error(err);
        this.stopWatchMerge();
        this.startWatchMerge();
    } else {
        if (this.mergeMgr.addEvent(event)) {
            emitter.emit(MERGE_CARD_EVENT, event);
        }
    }
}


BTKMergeCtrl.prototype.mergeCard = function(address, target, cards, callback) {
    console.log(target, cards);
    if (web3.isAddress(address)) {
        this.contract.mergeCard(target, cards,{
            from: address,
            gas: 1500000
        }, callback)
    } else {
        callback(new Error("btkMergeCtrl merge card error is not address" + address));
    }
}

BTKMergeCtrl.prototype.addMergeListener = function(listener) {
    emitter.on(MERGE_CARD_EVENT, listener);
}

BTKMergeCtrl.prototype.startWatchMerge = function() {
    if (this.mergeCardEvent) {
        return;
    }

    this.mergeCardEvent = this.contract.MergeCard(null, null, this.onMergeCard.bind(this));
}

BTKMergeCtrl.prototype.stopWatchMerge = function() {
    if (this.mergeCardEvent) {
        this.mergeCardEvent.stopWatching();
        this.mergeCardEvent = null;
    }
}

var btkMergeCtrl = new BTKMergeCtrl();
btkMergeCtrl.initMergeInfo();
btkMergeCtrl.startWatchMerge();

process.on('SIGINT', function() {
    btkMergeCtrl.stopWatchMerge();
    console.log('merge ctrl stop watch merge');
})

module.exports = btkMergeCtrl;