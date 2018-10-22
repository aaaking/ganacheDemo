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

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "47.52.224.7",  // Connect to geth on the specified
      port: 8545,
      from: "0x4BaBf11D785922DDDb51076AC0030FDC41778607",
      network_id: 4,
      gas: 4612388  // Gas limit used for deploys
    },
  }
};
