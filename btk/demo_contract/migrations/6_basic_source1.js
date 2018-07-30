var BasicSource = artifacts.require("./Package/BasicSource1.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicSource);
};
