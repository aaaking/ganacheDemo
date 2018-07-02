var BTKMediator = artifacts.require("./BTKMediator.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BTKMediator);
};