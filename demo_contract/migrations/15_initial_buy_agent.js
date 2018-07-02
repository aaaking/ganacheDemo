var BuyAgent = artifacts.require("./Agent/BuyAgent.sol");
var Utils = artifacts.require("./libs/Utils.sol");

module.exports = function(deployer, network) {
    deployer.deploy(Utils);
    deployer.link(Utils, BuyAgent);
    deployer.deploy(BuyAgent);
};
