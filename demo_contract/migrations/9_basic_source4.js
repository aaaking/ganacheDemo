var BasicSource = artifacts.require("./Package/BasicSource4.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicSource);
};
