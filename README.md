# ganacheDemo

[以太坊开发（一）——Truffle和Ganache](https://blog.csdn.net/turkeycock/article/details/79165602)

[Solidity 官方文档中文版](http://wiki.jikexueyuan.com/project/solidity-zh/)

[区块链技术（一）：Truffle开发入门](http://wiki.jikexueyuan.com/project/blockchain/truffle-introduction-development.html)

[以太坊DApp开发入门](http://xc.hubwiz.com/course/5a952991adb3847553d205d1?affid=20180327jianshu)

truffle ubox metacoin //创建项目

Compile:              truffle compile
Migrate:              truffle migrate
Test contracts:       truffle test
Run linter:           npm run lint
Run dev server:       npm run dev
Build for production: npm run build


truffle develop //进入控制台


编译项目
$ truffle compile //编译项目
部署项目
部署之前先启动TestRPC $ testrpc

$ truffle deploy
启动服务
$ truffle serve

web3.eth.coinbase

默认的函数参数，包括返回的参数，他们是memory。默认的局部变量是storage的。而默认的状态变量（合约声明的公有变量）是storage。

另外还有第三个存储位置calldata。它存储的是函数参数，是只读的，不会永久存储的一个数据位置。外部函数的参数（不包括返回参数）被强制指定为calldata。效果与memory差不多。

开始测试，输入truffle console打开truffle控制台，测试刚才我们部署的HelloWorld合约：

yuyangdeMacBook-Pro:TestTruffle yuyang$ truffle console
truffle(development)> var contract
undefined
truffle(development)> HelloWorld.deployed().then(function(instance){contract= instance;});
undefined
truffle(development)> contract.say()
'Hello World'
truffle(development)> contract.print("Hello World!")
'Hello World!'

One thing to check would be the network ID. It doesn't matter what network ID you use for your local test node, but Truffle needs to agree about what you're using with testrpc.

With testrpc running, do: 

curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[]}' http://localhost:8545

This should tell you the network ID that testrpc is using; Recent versions seem to be using what looks like a timestamp from when it was started.

Then take a look in the contract definition files under truffle/build/contracts and see if they have the same network ID specified as the key in the networks section. If they don't, you might want to try specifying the network ID in your truffle.js and redeploying. (By default this uses "*", which should work it out automatically, but I've had problems with it occasionally for reasons I never got to the bottom of.) Superstitiously, I would also delete the contents of the build directory and run truffle deploy again.

If this turns out to be the problem, you can force testrpc to use the same network ID every time by running it with the --network-id flag, eg to use the network ID 1337 you would run testrpc --network-id 1337.
