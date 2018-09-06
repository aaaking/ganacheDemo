var AncientGate = artifacts.require("./AncientGate.sol");

// var GeneticAlgorithm = artifacts.require("./Genetic/GeneticAlgorithm.sol");
// var Jurassic = artifacts.require("./Jurassic/Jurassic.sol");
// var SaleDutchAuction = artifacts.require("./Auction/SaleDutchAuction.sol");
// var SiringDutchAuction = artifacts.require("./Auction/SiringDutchAuction.sol");

// var Utils = artifacts.require("./Utils.sol");

function web3AsynWrapper(web3Fun) {
  return function (arg) {
    return new Promise((resolve, reject) => {
      web3Fun(arg, (e, data) => e ? reject(e) : resolve(data))
    })
  }
}

module.exports = function (deployer, network, accounts) {
  // console.log('---------1_initial_migration.js--------------')
  console.log('--network--', network)

  // web3.eth.getBlock("latest", function (err, res) {
  //   console.log('-----getBlock----err---', err)
  //   console.log('-----getBlock----res.gasLimit---', res.gasLimit)
  // })

  var gasLimit = web3.eth.getBlock("latest").gasLimit;
  console.log('--gasLimit--', gasLimit)
  // web3.personal.lockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", function (err, res) {
  //   console.log('-----err-----', err)
  //   console.log('-----res-----', res)
  // })
  // web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 10)
  // deployer.deploy(AncientGate)
  //   .then(res => {
  //     console.log('----deploy AncientGate res-----')
  //   })
  //   .catch(err => {
  //     console.log('----deploy AncientGate err-----')
  //   });
  // .then(res => console.log('Account unlocked!', res))
  // .catch(err => console.log('----unlocked err----', err));
  // deployer.deploy(GeneticAlgorithm);
  // deployer.deploy(Jurassic, { gas: 67219740 });
  // deployer.deploy(SaleDutchAuction);
  // deployer.deploy(SiringDutchAuction);
};
