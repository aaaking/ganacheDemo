var BasicComp = artifacts.require("./Package/BasicComp4.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicComp);
};
