// 41c757e14a7beb999f7e417c36f039af2b38c1ec1620122f3e33702e26158722 n1ktDUiZ5ry4fTUWdq8F2dB2ppogWeMAiQe
// 93b0d0d5efc8332ba4a6b905608a1cddcf9267a765567192b80e04c12d4a15d6 n1iBF1TohLcSaRghKCDjSmD4QzwBpmummfU title
// d387cb867418f58e91e02434de09baad16e57f62d9e9784e4e20d2a4993772a7 n1z3WVpvAUSAZ8wn9RdhF9GZZjA1XDFbnHy array
// 923075906527db6b7e5e45366d9a786d9fca5c986a81f8bf08c781aa5289f977 n1j3NVZXEk3gga6asNNo2WuVJ9GANXuTUYx data
// 79d90b6e4827662e5dfdddd7012a6cd6f7cd5d8bf88453205d2461d7f16ad704 n1nHuZZXoEdfSrdMAXk1unajN5JGX58PdZZ array without filter which means all data
// 910e8ec225f2ccb45d35ce92a6bc8bd8e55ad8ff390b9d5d493726014343569d n21Kv69NcP1Az4Vm75673J1MG5zTScxjRZ9
// 这里的status可能有三种状态值，0，1和2。
// 0: 交易失败. 表示当前交易已经上链，但是执行失败了。可能是因为部署合约或者调用合约参数错误。
// 1: 交易成功. 表示当前交易已经上链，而且执行成功了。
// 2: 交易待定. 表示当前交易还没有上链。可能是因为当前交易还没有被打包；如果长时间处于当前状态，可能是因为当前交易的发送者账户的余额不够支付上链手续费。

// I think Nebulas describes a new blockchain world with three key features:
// Value Ranking: Nebulas Rank (NR) provides a measure of value for every unit in the blockchain.
// Self-evolving: Nebulas Force (NF) enables Nebulas to respond to new demands without forks.
// Native Incentive: Nebulas Incentive (NI) rewards developers and virtuous users who devotes.
// I view Nebulas as a living blockchain. It’s just like a little boy; observing this novel world with his sparkling eyes (NR), 
// showing his lovely smile to people who care for him (NI) and growing up surrounded by tender loving care everyday (NF).

// In Nebulas, we have three kinds of transactions: binary, deploy and call.
// 1 Binary transactions are used to transfer tokens between accounts.
// 2 Deploy transactions are used to deploy a smart contract.
// 3 Call transactions are used to call functions in a deployed smart contract.
var SecretItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.title = obj && obj.title || ""
        this.content = obj && obj.content || ""
        this.author = obj && obj.author || ""
        this.index = obj && obj.index || 0
        this.timestamp = obj && obj.timestamp || new Date().getTime()
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
    LocalContractStorage.defineMapProperty(this, "userMap");
    LocalContractStorage.defineMapProperties(this, {
        arrayMap: null
    });
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new SecretItem(text)
        },
        stringify: function (o) {
            return o.toString()
        }
    });
    // 一个自定义的 `descriptor` 实现
    // 在解析的时候返回 BigNumber 对象
    LocalContractStorage.defineProperty(this, "value1", {
        stringify: function (obj) {
            return obj.toString();
        },
        parse: function (str) {
            return new BigNumber(str);
        }
    });
    // 用默认的序列化实现批量绑定
    LocalContractStorage.defineProperties(this, {
        name2: null,
        value2: null
    });
}

// 接下来，只需要再编写两个函数，一个是存储秘密，一个是查询秘密，逻辑比较简单，直接贴代码：
TheSecret.prototype = {
    init: function () {
        console.log('init: Blockchain.block.timestamp = ' + Blockchain.block.timestamp);
        console.log('init: Blockchain.block.height = ' + Blockchain.block.height);
        this.size = 0;
    },
    set: function (title, content) {
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
        var index = this.size;
        this.arrayMap.set(index, title);
        secretItem = new SecretItem()
        secretItem.author = from;
        secretItem.title = title
        secretItem.content = content
        secretItem.index = index
        secretItem.timestamp = new Date().getTime()
        this.data.put(title, secretItem)
        this.size += 1;
    },
    get: function (title) {
        if (!title) {
            return []
        }
        var result = []
        result.push(this.data.get(title))
        return result
    },
    getSimilar: function (titleP) {
        var title = titleP.replace(/(^\s*)|(\s*$)/g, "")
        if (!title) {
            return []
        }
        var result = []
        for (var i = 0; i < this.size; i++) {
            var key = this.arrayMap.get(i);
            var obj = this.data.get(key)
            if (
                (key && key.toString().search(new RegExp(title + "")) > -1)
                || (obj && obj.toString().search(new RegExp(title + "")) > -1)
            ) {
                result.push(obj)
            }
        }
        return result
    },
    getSimilarTitle: function (titleP) {
        var title = titleP.replace(/(^\s*)|(\s*$)/g, "")
        if (!title) {
            return []
        }
        var result = []
        for (var i = 0; i < this.size; i++) {
            var key = this.arrayMap.get(i);
            var obj = this.data.get(key)
            if (key && key.toString().search(new RegExp(title + "")) > -1) {
                result.push(obj)
            }
        }
        return result
    },
    getSimilarContent: function (titleP) {
        var title = titleP.replace(/(^\s*)|(\s*$)/g, "")
        if (!title) {
            return []
        }
        var result = []
        for (var i = 0; i < this.size; i++) {
            var key = this.arrayMap.get(i);
            var obj = this.data.get(key)
            if (obj && obj.toString().search(new RegExp(title + "")) > -1) {
                result.push(obj)
            }
        }
        return result
    },
    del: function () {

    },
    len: function () {
        return this.size;
    },
    getAll: function (limit, offset) {
        limit = parseInt(limit) || this.size;
        offset = parseInt(offset) || 0;
        if (offset > this.size) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.size) {
            number = this.size;
        }
        var result = [];
        for (var i = offset; i < number; i++) {
            var key = this.arrayMap.get(i);
            var object = this.data.get(key);
            result.push(object)
        }
        return result;
    },

    //test
    transfer: function (address, value) {
        var result = Blockchain.transfer(address, value);
        console.log("transfer result:", result);
    },
    verifyAddress: function (address) {
        var result = Blockchain.verifyAddress(address);
        console.log("verifyAddress result:", result);
    },
    testError: function () {
        throw new Error(JSON.stringify({code: 1, msg: "errorMsg"}));
    },
    // Event 模块用来记录在合约执行过程中产生的事件。被记录的事件存储在链上的事件Trie结构中，可以通过事件查询方法
    // [rpc.getEventsByHash](https://github.com/nebulasio/wiki/blob/master/rpc.md#geteventsbyhash) 获取所有事件。
    // 通过`Event`模块输出的事件其最终Topic由用户自定义topic加固定前缀 chain.contract. 两部分构成 。使用方法如下：
    // Event.Trigger(topic, obj);
    // · topic：用户定义的topic
    // · obj：JSON 对象
    testEvent: function () {
        // 实际被存储的topic是“chain.contract.topic”
        Event.Trigger("topic", {
            Data: {
                value: "Event test."
            }
        });
    }
}
module.exports = TheSecret