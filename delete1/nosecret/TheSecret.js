// 41c757e14a7beb999f7e417c36f039af2b38c1ec1620122f3e33702e26158722 n1ktDUiZ5ry4fTUWdq8F2dB2ppogWeMAiQe
// 93b0d0d5efc8332ba4a6b905608a1cddcf9267a765567192b80e04c12d4a15d6 n1iBF1TohLcSaRghKCDjSmD4QzwBpmummfU title
// d387cb867418f58e91e02434de09baad16e57f62d9e9784e4e20d2a4993772a7 n1z3WVpvAUSAZ8wn9RdhF9GZZjA1XDFbnHy array
// 923075906527db6b7e5e45366d9a786d9fca5c986a81f8bf08c781aa5289f977 n1j3NVZXEk3gga6asNNo2WuVJ9GANXuTUYx data
// 79d90b6e4827662e5dfdddd7012a6cd6f7cd5d8bf88453205d2461d7f16ad704 n1nHuZZXoEdfSrdMAXk1unajN5JGX58PdZZ array without filter which means all data
// 这里的status可能有三种状态值，0，1和2。
// 0: 交易失败. 表示当前交易已经上链，但是执行失败了。可能是因为部署合约或者调用合约参数错误。
// 1: 交易成功. 表示当前交易已经上链，而且执行成功了。
// 2: 交易待定. 表示当前交易还没有上链。可能是因为当前交易还没有被打包；如果长时间处于当前状态，可能是因为当前交易的发送者账户的余额不够支付上链手续费。
var SecretItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.title = obj.title
        this.content = obj.content
        this.author = obj.author
        this.timestamp = new Date().getTime()
    }
}

SecretItem.prototype = {
    toString: function () {
        return JSON.stringify(this)
    }
}

// 其次，我们应该可以有权限访问我们自己智能合约的存储空间，所以根据官方的API来创建存储空间：
// 这里的数据是以kep-value形式存储的。相信大家很容易理解。
var TheSecret = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new SecretItem(text)
        },
        stringify: function (o) {
            return o.toString()
        }
    })
}

// 接下来，只需要再编写两个函数，一个是存储秘密，一个是查询秘密，逻辑比较简单，直接贴代码：
TheSecret.prototype = {
    init: function () {

    },
    save: function (title, content) {
        if (!title || !content) {
            throw new Error("empty title or content")
        }
        if (title.length > 20 || content.legnth > 500) {
            throw new Error("title or content exceed limit length")
        }
        var from = Blockchain.transaction.from;
        var secretItem = this.data.get(title);
        if (secretItem) {
            throw new Error("secret has been occupied")
        }
        secretItem = new SecretItem()
        secretItem.author = from;
        secretItem.title = title
        secretItem.content = content
        this.data.put(title, secretItem)
    },
    get: function (title) {
        if (!title) {
            throw new Error("empty title")
        }
        var result = []
        for (var key in this.data) {
            // if (this.data.get(key) && this.data.get(key).search(title)) {
            //     result.push(this.data.get(key))
            // }
            if (this.data.get(key)) {
                result.push(this.data.get(key))
            }
        }
        // return result
        return this.data.get(title)
        // return this.data
    }
}
module.exports = TheSecret