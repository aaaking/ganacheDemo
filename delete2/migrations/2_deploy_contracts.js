// var ConvertLib = artifacts.require("./ConvertLib.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");

module.exports = function(deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, SanGuoSha);
  deployer.deploy(HelloWorld);
};
