var CardOwnership = artifacts.require("./CardOwnership.sol");

module.exports = function(deployer, network) {
    deployer.deploy(CardOwnership);
};
