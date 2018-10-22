/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// local: {
//   networks: {
//     development: {
//       host: "127.0.0.1",
//         port: 8545,
//           network_id: "*"
//     }
//   }
// }
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "range hurt spice mom volcano sight eight enlist kid fiber produce obey";

// const Web3 = require("web3");
// const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

var rinkebyPrivateKey = new Buffer("D4E754DF1177C4C81172C832AF7EECF2F8ECEC06E6ACFF46165FD1DD1ECA1D7C", "hex")
var rinkebyWallet = Wallet.fromPrivateKey(rinkebyPrivateKey);
var rinkebyProvider = new WalletProvider(rinkebyWallet, "https://rinkeby.infura.io/");
module.exports = {
  // https://medium.com/coinmonks/the-many-ways-to-deploy-your-smart-contract-to-rinkeby-network-38cadf7b20be
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    infura: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/1ef6eda7b4cb4444b3b6907f2086ba89')
      },
      network_id: 4,
      gas: 7450000,
      gasPrice: 90000000000 // 10 gwei
    },
    dev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: rinkebyProvider,
      host: "47.52.224.7",  // Connect to geth on the specified
      port: 8545,
      from: "0x4BaBf11D785922DDDb51076AC0030FDC41778607",
      network_id: 4,
      gas: 4500000, // Gas limit used for deploys
      gasPrice: 1000000000 // 10 gwei
    },
  }
};
