1、需要注意的是 cleos是eos的命令行工具，它分别与两个eos组件进行交互， [keosd, nodeos]
	
keosd -> 是eos的钱包组件，只负责管理钱包及钱包内的eos账户。

nodeos -> 是eos的节点组件，在它上面负责交易，已经账户管理。  **注意这里的账户并非eos账户，而是对应eos地址的命名账户，类似与DNS的概念，一个eos账户可以对应多个eos节点账户。**


2、与keosd和nodeos交互，

cleos --wallet-url http://127.0.0.1:8899    // 与keosd交互

cleos --wallet-url http://193.93.219.219:8889 -u http://193.93.219.219:8888 get account aaaking35512 这里需要注意的是，我们在与nodeos交互时，必须显示声明keosd交互的wallet-url才行，且两个组件不能监听同一个端口。 ***

2.1、 导入 eosio账户， 其eos地址私钥为 -> 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

3、基本操作

	(1) 钱包相关：
		cleos wallet create [--name walletname]
		
		cleos wallet import eos_privatekey  //导入eos地址 

		cleos wallet list
		
		cleos wallet keys
		
	(2) eos地址创建相关：
		cleos create key    // 创建eos地址
		
		
	(3) 创建合约:
		首先需要创建合约账户，和普通账户没有区别。
		导入eosio.bios合约
		cleos set contract eosio /contracts/eosio.bios -p eosio@active
		cleos create account eosio(gm账户) youraccoutname eos地址
		cleos get account eos地址    	// 显示地址下的链上账户名
		
		3.1: 创建合约账户 
			cleos create account eosio contractAccount eos地址
		3.2: 创建合约
			cleos set contract contractAccount 合约文件路径 -p contractAccount@active(权限)
		3.3: 合约操作
			cleos push action contractAccount ActionName “action的参数数组" -p 执行者的权限	
			
			
	(4) 发币:   ##[主账户发的币，是无法显示出自己有多少该币的，它没有所有权]
		cleos push action 发币合约账户 create '["主账户", "总量 币名缩写"]' -p 发币合约账户@active
		// 主账户直接分钱
		cleos push action 发币合约账户 issue '["用户账户", "数量 币名", "memo 备注"]' -p 主账户@activie
		// transfer转币
		cleos push action 发币合约账户 transfer '["from", "to", "数量 币名", "备注"]' -p from@active
		
		
	(5) 币数量查询：
		cleos get currency balance 发币合约账户 用户 [币名]   // 币名不写则显示全部币	
		

附带一些docker的操作:

```
docker run -d -p [绑定docker虚拟机与本机的ip映射] -v [/tmp/...本地路径:容器内路径 进行虚拟映射][各种参数设置] --name 容器名字  容器image对象 启动容器执行的第一个操作。

docker attach -t 容器名字

docker exec -it 容器名字 bash   // 可以进入到容器运行的环境中进行操作。
```
		
		
PW5JLX4Ydk2aAT25WEYtwmwwgcK6dVxGYdn4UnkB6Kq7wp263FLoA
Private key: 5JREFz47gqBFmG1FV8iWiFRhFhqXa3jsnrF3TQLk1cLKXgFLh22
Public key: EOS5pzh7ocMDb8UKojPtAVEsLFwgXgucYZFyLvj13FtAXMPgmRLFL

Private key: 5JMtd2Afp3PL1SEnPcTjyoVyy3XWFfPZGAFL2frGp8hHxxf8izM
Public key: EOS5Mixobba3mLZkG3hajXGJ5T5yp21MpbMjEG8P911VB3gT8ZaEG

在启动nodeos时，添加参数：--filter-on "*"







http://jungle.cryptolions.io/#  测试网络
https://github.com/EOSIO/eosjs  js库
https://developers.eos.io/ eos开发者文档
https://eosfans.io/  这个是国内的一个社区   好像要翻墙
https://get-scatter.com/ 这个好像是一个钱包插件
https://github.com/leordev/monstereos/blob/master/src/index.js
