var CardOwnership = artifacts.require("./CardOwnership.sol");
var BTKMergeCtrl = artifacts.require("./BTKMergeCtrl.sol");


function toToken(id, code) {
    var cardId = '0x' + id.toString(16) + '00000000';
    cardId = web3.toBigNumber(cardId);
    return token = cardId.plus(code).toString();
}


contract('BTKMergeCtrl', function(accounts) {
    var wallet;
    var mergeCtrl;
    var account = web3.eth.accounts[0];

    var targetCards = [50111, 60101, 60111, 70101, 80101, 90101, 100101];

    it('should merge a 5 star card', function() {
        var cards = [40111, 40111, 40111, 40111, 30101, 30101, 30101, 30101, 40112, 40112, 40112, 40112];

        var targetCard = 50111;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+500));
        }

        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function() {
            return wallet.balanceOf(account);
        }).then(function(balance) {
            return assert.equal(balance, tokens.length, "1111");
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments);
            console.log(1111);
        })
    });

    it('should merge a 6 star card 0', function() {
        var cards = [50101, 50101, 50111, 50111, 50101, 50101];

        var targetCard = 60101;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+600));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function() {
            return wallet.balanceOf(account);
        }).then(function(balance) {
            return assert.equal(balance.toNumber(), tokens.length + 1, "1111");
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments[0].logs);
            console.log(1111);
        })
    });

    it('should merge a 6 star card 1', function() {
        var cards = [50111, 50111, 50113, 50111, 50101, 50101];

        var targetCard = 60111;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i + 700));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function() {
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments[0].logs.ar);
            console.log(1111);
        })
    });

    it('should merge a 7 star card', function() {
        var cards = [60101, 50111, 50113, 50111, 50101];

        var targetCard = 70101;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+800));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(transaction){
            event = transaction.logs[0].args;
            console.log(event);
        })
    });

    it('should merge a 8 star card', function() {
        var cards = [70101, 60103, 50111, 50101, 50101];

        var targetCard = 80101;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+900));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments[0].logs);
            console.log(1111);
        })
    });

    it('should merge a 9 star card', function() {
        var cards = [80101, 50101, 60101, 50101, 50101];

        var targetCard = 90101;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+1000));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments[0].logs);
            console.log(1111);
        })
    });

    it('should merge a 10 star card', function() {
        var cards = [90101, 90111, 50101, 50101, 60101];

        var targetCard = 100101;
        var tokens = [];
        for(let i = 0; i < cards.length; i++) {
            tokens.push(toToken(cards[i], i+1100));
        }
        return CardOwnership.deployed().then(function(instance) {
            wallet = instance;

            promises = [];
            for(let i = 0; i< tokens.length; i++){
                promises.push(instance.mintByOwner(account, tokens[i]))
            }

            return Promise.all(promises);
        }).then(function(){
            return BTKMergeCtrl.deployed();
        }).then(function(_mergeCtrl) {
            mergeCtrl = _mergeCtrl;
            return mergeCtrl.mergeCard(targetCard, tokens, {from: account});
        }).then(function(){
            console.log(arguments[0].logs);
            console.log(1111);
        })
    });
})