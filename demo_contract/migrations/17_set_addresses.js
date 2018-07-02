var BTKSourceCtrl = artifacts.require("./BTKSourceCtrl.sol");
var BTKMergeCtrl = artifacts.require("./Merge/BTKMergeCtrl.sol");
var BTKMediator = artifacts.require("./BTKMediator.sol");

var Random = artifacts.require("./Random.sol");

var BasicComp1 = artifacts.require("./Package/BasicComp1.sol");
var BasicComp2 = artifacts.require("./Package/BasicComp2.sol");
var BasicComp3 = artifacts.require("./Package/BasicComp3.sol");
var BasicComp4 = artifacts.require("./Package/BasicComp4.sol");

var BasicSource1 = artifacts.require("./Package/BasicSource1.sol");
var BasicSource2 = artifacts.require("./Package/BasicSource2.sol");
var BasicSource3 = artifacts.require("./Package/BasicSource3.sol");
var BasicSource4 = artifacts.require("./Package/BasicSource4.sol");

var CardOwnership = artifacts.require("./CardOwnership.sol");

var SellAgent = artifacts.require("./Agent/SellAgent.sol");
var BuyAgent = artifacts.require("./Agent/BuyAgent.sol");

module.exports = function(deployer, network){
    BTKSourceCtrl.deployed().then(function(btkSourceCtrl) {
        btkSourceCtrl.addPackage(BasicSource1.address, 0);
        btkSourceCtrl.addPackage(BasicSource2.address, 0);
        btkSourceCtrl.addPackage(BasicSource3.address, 0);
        btkSourceCtrl.addPackage(BasicSource4.address, 0);

        btkSourceCtrl.setMediator(BTKMediator.address);
        btkSourceCtrl.setRandomAddress(Random.address);
    });

    BTKMergeCtrl.deployed().then(function(btkMergeCtrl) {
        btkMergeCtrl.addPackage(BasicComp1.address, 0);
        btkMergeCtrl.addPackage(BasicComp2.address, 0);
        btkMergeCtrl.addPackage(BasicComp3.address, 0);
        btkMergeCtrl.addPackage(BasicComp4.address, 0);

        btkMergeCtrl.setMediator(BTKMediator.address);
    })

    BTKMediator.deployed().then(function(btkMediator) {
        btkMediator.setMergeCtrl(BTKMergeCtrl.address);
        btkMediator.setSourceCtrl(BTKSourceCtrl.address);
        btkMediator.setCardOwnership(CardOwnership.address);
    })

    BasicSource1.deployed().then(function(bs1) {
        bs1.transferCtrlShip(BTKSourceCtrl.address);
    })
    BasicSource2.deployed().then(function(bs2) {
        bs2.transferCtrlShip(BTKSourceCtrl.address);
    })
    BasicSource3.deployed().then(function(bs3) {
        bs3.transferCtrlShip(BTKSourceCtrl.address);
    })
    BasicSource4.deployed().then(function(bs4) {
        bs4.transferCtrlShip(BTKSourceCtrl.address);
    })

    BasicComp1.deployed().then(function(bc1) {
        bc1.transferCtrlShip(BTKMergeCtrl.address);
    })
    BasicComp2.deployed().then(function(bc2) {
        bc2.transferCtrlShip(BTKMergeCtrl.address);
    })
    BasicComp3.deployed().then(function(bc3) {
        bc3.transferCtrlShip(BTKMergeCtrl.address);
    })
    BasicComp4.deployed().then(function(bc4) {
        bc4.transferCtrlShip(BTKMergeCtrl.address);
    })

    CardOwnership.deployed().then(function(co) {
        co.transferCtrlShip(BTKMediator.address);
    })

    SellAgent.deployed().then(function(sellagent) {
        sellagent.setNftContractAddress(CardOwnership.address);
    })

    BuyAgent.deployed().then(function(buyagent) {
        buyagent.setNftContractAddress(CardOwnership.address);
        buyagent.setCardCheckerAddress(BTKMediator.address);
    })
}