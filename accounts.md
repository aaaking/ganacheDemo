# n1VovrGLzqCP2PQE6RB1b96b6bVeQTTaELq.json -- Zzh5
{"version":4,"id":"71fef981-7354-4f84-bfd3-dd9bbc981ae5","address":"n1VovrGLzqCP2PQE6RB1b96b6bVeQTTaELq","crypto":{"ciphertext":"9e793dd1c4974f3b885a3df744ee8fcefaa6e6885ca604702891327b561b7e12","cipherparams":{"iv":"d264c10783a64d3a23255ea50c700510"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"7ebd04c97da8d2f8559b46dc37931673a30426b2b2fad97f9b41c07d812b4eef","n":4096,"r":8,"p":1},"mac":"31d5bb89392a26e09980ff30d3e1ad3913c3ed446fff3a9e5b7965c007ab6cb8","machash":"sha3256"}}

# n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq.json -- Zzh6
{"version":4,"id":"3428a426-6e22-4c83-81de-1bc1839b2d39","address":"n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq","crypto":{"ciphertext":"347d0d2029697f8ee743e09e2046cf77917b87a6bb7f403d0f847b8f561393ab","cipherparams":{"iv":"2262561670aa59e8575d4a2fc5d0faf5"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"617a2a42410e20ed1de21e2ab4b533c14ed5c8b133e1dd9f63258bd447fac74e","n":4096,"r":8,"p":1},"mac":"8bce73526ae36dd46679adc57a28e7e88a5adb0e811df69f6046bd91eb8b07b8","machash":"sha3256"}}

# ./neb account new
# n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh -- Zzh6

# n1b1Ez9tpZStgnKfC17ME5T1PQBXshn6j9f -- Zzh6

https://testnet.nebulas.io -- https://mainnet.nebulas.io

curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/account/unlock -d '{"address":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh","passphrase":"passphrase","duration":"1000000000"}'
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/account/lock -d '{"address":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh"}'

curl -i -H Accept:application/json -X POST http://localhost:8685/v1/user/accountstate -d '{"address":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh"}'
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/user/accountstate -d '{"address":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh"}'

# 签名 & 发送
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/sign -d '{"transaction":{"from":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","to":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh", "value":"1000000000000000000","nonce":1,"gasPrice":"1000000","gasLimit":"2000000"}, "passphrase":"passphrase"}'
然后，我们将签好名的交易原始数据提交到本地私有链里的星云节点。
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/user/rawtransaction -d '{"data":"CiAbjMP5dyVsTWILfXL1MbwZ8Q6xOgX/JKinks1dpToSdxIaGVcH+WT/SVMkY18ix7SG4F1+Z8evXJoA35caGhlXbip8PupTNxwV4SRM87r798jXWADXpWngIhAAAAAAAAAAAA3gtrOnZAAAKAEwuKuC1wU6CAoGYmluYXJ5QGRKEAAAAAAAAAAAAAAAAAAPQkBSEAAAAAAAAAAAAAAAAAAehIBYAWJBVVuRHWSNY1e3bigbVKd9i6ci4f1LruDC7AUtXDLirHlsmTDZXqjSMGLio1ziTmxYJiLj+Jht5RoZxFKqFncOIQA="}'
{"result":{"txhash":"1b8cc3f977256c4d620b7d72f531bc19f10eb13a05ff24a8a792cd5da53a1277","contract_address":""}}

# 密码 & 发送
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/transactionWithPassphrase -d '{"transaction":{"from":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","to":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh", "value":"1000000000000000000","nonce":2,"gasPrice":"1000000","gasLimit":"2000000"},"passphrase":"passphrase"}'

# 解锁 & 发送
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/account/unlock -d '{"address":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh","passphrase":"passphrase","duration":"100000000000"}'
curl -i -H 'Content-Type: application/json' -X POST http://localhost:8685/v1/admin/transaction -d '{"from":"n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE","to":"n1WU5PThmwgbuHFVopJG8cwf2EUB1FdSsxh", "value":"1000000000000000000","nonce":3,"gasPrice":"1000000","gasLimit":"2000000"}'

# 交易收据
curl -i -H Accept:application/json -X POST http://localhost:8685/v1/user/getTransactionReceipt -d '{"hash":"939ac2fd510de60a05a590e335ac4d3e75393aa093c2762ee521eaa4040368d3"}'

