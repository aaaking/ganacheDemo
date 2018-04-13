// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*' // Match any network id
        },
        zzh_mac: {//部署到指定的网络，可以使用--network参数，例如：truffle migrate --network zzh_mac
            host: "10.30.20.118", // Random IP for example purposes (do not use)
            port: 6899,
            network_id: 1        // Ethereum public network
            // optional config values:
            // gas  Gas limit used for deploys. Default is 4712388
            // gasPrice Gas price used for deploys. Default is 100000000000 (100 Shannon).
            // from - default address to use for any transaction Truffle makes during migrations
            // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
            //          - if specified, host and port are ignored.
        }
    }
}
