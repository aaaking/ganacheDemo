var SellAgent = artifacts.require("./Agent/SellAgent.sol");
var Utils = artifacts.require("./libs/Utils.sol");

module.exports = function(deployer, network) {
    deployer.deploy(Utils);
    deployer.link(Utils, SellAgent);
    deployer.deploy(SellAgent);
};
