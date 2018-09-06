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
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "range hurt spice mom volcano sight eight enlist kid fiber produce obey"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    infura: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/1ef6eda7b4cb4444b3b6907f2086ba89')
      },
      network_id: '4',
      gas: 7650000,
      gasPrice: 10000000000,
    },
    dev: {
      host: "47.52.224.7",
      port: 8545,
      network_id: "4", // Match any network id
      from: "0xc7B5F6d0245339674ae4264E44173bC606881651",
      gas: 7450000,
      gasPrice: 3000000000 // 10 gwei
    },
    rinkeby: {
      host: "192.168.1.59",
      // host: "43.255.52.13",
      // host: "192.168.1.11",
      port: 8545,
      from: "0x270344c85532a95Ba6A0AEE14D10ed4C126d0134", // enter your local rinkeby unlocked address
      network_id: 4,
      gas: 4500000, // Gas limit used for deploys
      gasPrice: 10000000000 // 10 gwei
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
