var web3 = require('../web3');
var data = require('./config/BTKSourceCtrl.json');
var config = AppConfig.web3;
var EventEmitter = require('events').EventEmitter;

var EventManager = require('../utils/EventManager');

var BUY_PACKAGE_EVENT = 'BuyPackage'
var emitter = new EventEmitter();

var BTKSourceCtrl = function() {
    this.addr = data.networks[config.networks].address
    this.contract = web3.eth.contract(data.abi).at(this.addr);
    this.buyMgr = new EventManager();
}

BTKSourceCtrl.prototype.onBuyPackage = function(err, event) {
    if (err) {
        console.error(err);
        btkSourceCtrl.stopWatchBuyPackage();
        btkSourceCtrl.startWatchBuyPackage();        
    } else {
        if (this.buyMgr.addEvent(event)) {
            emitter.emit(BUY_PACKAGE_EVENT, event);
        }
    }
}


BTKSourceCtrl.prototype.buyPackage = function(address, callback) {
    if (web3.isAddress(address)) {
        this.contract.buyPackage.sendTransaction({
            from: address,
            value: web3.toWei(config.packagePrice, 'ether'),
            gas: 400000
        }, callback)
    } else {
        callback(new Error("btkSourceCtrl buy package error is not address" + address));
    }
}

BTKSourceCtrl.prototype.addBuyPackageListener = function(listener) {
    emitter.on(BUY_PACKAGE_EVENT, listener);
}

BTKSourceCtrl.prototype.startWatchBuyPackage = function() {
    if (this.buyPackageEvent) {
        return;
    }

    this.buyPackageEvent = this.contract.BuyPackage(null, null, this.onBuyPackage.bind(this));
}

BTKSourceCtrl.prototype.stopWatchBuyPackage = function() {
    if (this.buyPackageEvent) {
        this.buyPackageEvent.stopWatching();
        this.buyPackageEvent = null;
    }
}

var btkSourceCtrl = new BTKSourceCtrl();
btkSourceCtrl.startWatchBuyPackage();

process.on('SIGINT', function() {
    btkSourceCtrl.stopWatchBuyPackage();
    console.log('source ctrl stop watch buy package');
})

module.exports = btkSourceCtrl;