# ganacheDemo

[以太坊开发](https://gasolin.gitbooks.io/learn-ethereum-dapp/content/?q=)

安装 TestRPC -- npm install -g ethereumjs-testrpc
部署合约之前启动testrpc     --   testrpc --gasLimit 0x800000000

truffle ubox metacoin //创建项目

truffle develop //进入控制台


编译项目
$ truffle compile //编译项目

$ truffle deploy
启动服务
$ truffle serve

默认的函数参数，包括返回的参数，他们是memory。默认的局部变量是storage的。而默认的状态变量（合约声明的公有变量）是storage。

另外还有第三个存储位置calldata。它存储的是函数参数，是只读的，不会永久存储的一个数据位置。外部函数的参数（不包括返回参数）被强制指定为calldata。效果与memory差不多。

yuyangdeMacBook-Pro:TestTruffle yuyang$ truffle console
truffle(development)> HelloWorld.deployed().then(function(instance){contract= instance;});

curl -i -H 'Content-Type: application/json' -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[]}' http://localhost:8545

web3.BigNumber             web3.createBatch           web3.fromAscii             web3.fromDecimal
web3.fromICAP              web3.fromUtf8              web3.fromWei               web3.isAddress
web3.isChecksumAddress     web3.isConnected           web3.isIBAN                web3.padLeft
web3.padRight              web3.reset                 web3.setProvider           web3.sha3
web3.toAscii               web3.toBigNumber           web3.toChecksumAddress     web3.toDecimal
web3.toHex                 web3.toUtf8                web3.toWei

web3._extend               web3._requestManager       web3.bzz                   web3.currentProvider
web3.db                    web3.eth                   web3.net                   web3.personal
web3.providers             web3.settings              web3.shh                   web3.version

truffle(develop)> web3.eth.
web3.eth.__defineGetter__          web3.eth.__defineSetter__          web3.eth.__lookupGetter__
web3.eth.__lookupSetter__          web3.eth.__proto__                 web3.eth.constructor
web3.eth.hasOwnProperty            web3.eth.isPrototypeOf             web3.eth.propertyIsEnumerable
web3.eth.toLocaleString            web3.eth.toString                  web3.eth.valueOf

web3.eth.contract                  web3.eth.defaultAccount            web3.eth.defaultBlock
web3.eth.filter                    web3.eth.icapNamereg               web3.eth.isSyncing
web3.eth.namereg

web3.eth._requestManager           web3.eth.accounts                  web3.eth.blockNumber
web3.eth.call                      web3.eth.coinbase                  web3.eth.compile
web3.eth.estimateGas               web3.eth.gasPrice                  web3.eth.getAccounts
web3.eth.getBalance                web3.eth.getBlock                  web3.eth.getBlockNumber
web3.eth.getBlockTransactionCount  web3.eth.getBlockUncleCount        web3.eth.getCode
web3.eth.getCoinbase               web3.eth.getCompilers              web3.eth.getGasPrice
web3.eth.getHashrate               web3.eth.getMining                 web3.eth.getProtocolVersion
web3.eth.getStorageAt              web3.eth.getSyncing                web3.eth.getTransaction
web3.eth.getTransactionCount       web3.eth.getTransactionFromBlock   web3.eth.getTransactionReceipt
web3.eth.getUncle                  web3.eth.getWork                   web3.eth.hashrate
web3.eth.iban                      web3.eth.mining                    web3.eth.protocolVersion
web3.eth.sendIBANTransaction       web3.eth.sendRawTransaction        web3.eth.sendTransaction
web3.eth.sign                      web3.eth.signTransaction           web3.eth.submitWork
web3.eth.syncing

# geth
geth init ./genesis.json --datadir "./chain"

geth \
  --identity "mshk.top etherum" \
  --rpcaddr 0.0.0.0 \
  --rpc \
  --rpcport 8545 \
  --maxpeers 2 \
  --rpcapi "db,eth,net,web3,debug" \
  --networkid 100 \
  --datadir "./chain" \
  --nodiscover \
    console 2>>eth_output.log