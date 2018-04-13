var ConvertLib = artifacts.require("./ConvertLib.sol");
var SanGuoSha = artifacts.require("./SanGuoSha.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, SanGuoSha);
  deployer.deploy(SanGuoSha);
};
