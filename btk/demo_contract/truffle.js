module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!

    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*", // Match any network id
            gas:4700000
        },
        test: {
            host: "127.0.0.1",
            port: 8500,
            network_id: "*", // Match any network id
            gas:4500000
        },

        release: {
            host: "61.147.167.163",
            port: 18545,
            network_id: "*",
            gas:4500000,
            from: "0xbdb38e163b9f3ff3e9cfda00c9dabf69ce52718b"
        }
    }
  
};
