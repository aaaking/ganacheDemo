"use strict";
var enableDebug = true;
var dappContactAddress = "n1iBF1TohLcSaRghKCDjSmD4QzwBpmummfU";
var account = {
    "version": 4,
    "id": "3428a426-6e22-4c83-81de-1bc1839b2d39",
    "address": "n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq",
    "crypto": {
        "ciphertext": "347d0d2029697f8ee743e09e2046cf77917b87a6bb7f403d0f847b8f561393ab",
        "cipherparams": {
            "iv": "2262561670aa59e8575d4a2fc5d0faf5"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "617a2a42410e20ed1de21e2ab4b533c14ed5c8b133e1dd9f63258bd447fac74e",
            "n": 4096,
            "r": 8,
            "p": 1
        },
        "mac": "8bce73526ae36dd46679adc57a28e7e88a5adb0e811df69f6046bd91eb8b07b8",
        "machash": "sha3256"
    }
}
var NebPay = require("nebpay")
var nebPay = new NebPay()
var serialNumber

var nebulas = require("nebulas")
var HttpRequest = nebulas.HttpRequest;
var Neb = nebulas.Neb;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://testnet.nebulas.io"));
var Account = nebulas.Account;
var Transaction = nebulas.Transaction;
var Unit = nebulas.Unit;
var NVM = nebulas.NVM;
var account, tx, txhash;
var block = {
    timestamp: 0,
    height: 1
};

var transaction = {
    hash: "90e7b51c417c6feff14635d47552e26295d05fb3228cbb35000f1b367527e833",
    from: "n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq",
    to: dappContactAddress,
    value: "0",
    nonce: 1,
    timestamp: 1527077193,
    gasPrice: "1000000",
    gasLimit: "20000"
};
$("#search").click(function () {
    if (!$("#search_title").val()) {
        alert('搜索标题不能为空');
        return;
    }
    $('#content').text("");
    // call("get", "[\"" + $("#search_title").val() + "\"]")
    var from = dappContactAddress
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "get";
    var callArgs = "[\"" + $("#search_title").val() + "\"]";
    var contract = {
        "function": callFunction,
        "args": callArgs
    }
    var numberDel = neb.api.call(account.address, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        console.log(numberDel)
        console.log(resp)
        var result = JSON.parse(resp.result);
        if (result === 'null') {
            $('#content').text("没有发现该标题秘密，你可以立即写一篇！");
            $('#title').text("");
            $('#author').text("");
            return;
        }
        // for (var i = 0; i < result.size; i++) {
        //     var item = result[i]
        //     $('#content').text("title:  " + item.title + "</br>");
        //     $('#content').text("content:  " + item.content + "</br>");
        //     $('#content').text("author:  " + item.author + "</br>");
        //     $('#content').text("timestamp:  " + item.timestamp + "</br></br>");
        // }
        $("#title").text(result.title);
        $('#content').text("正文:  " + result.content);
        $('#author').text("作者：" + result.author);
        var date = new Date(result.timestamp)
        $('#timestamp').text("日期：" + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + "  " + date.getHours() + ":" + date.getMinutes());
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
})

$('#post').click(function () {
    if (!$("#input_title").val() || !$("#input_content").val()) {
        alert('标题或者文本不能为空');
        return;
    }
    var to = dappContactAddress;
    var value = "0";
    var callFunction = "save";
    var callArgs = "[\"" + $("#input_title").val() + "\",\"" + $("#input_content").val() + "\"]";
    serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: function (resp) {
            console.log(resp)
            loopQuery(resp)
        },
        debug: enableDebug
    });
})

function loopQuery(serialNumberP) {
    nebPay.queryPayInfo(serialNumberP, { debug: enableDebug })   //search transaction result from server (result upload to server by app)
        .then(function (info) {
            info = JSON.parse(info);
            console.log(info)
            if (info && info.data && info.data.status == 0) {
                alert("failed reason：" + info.data.execute_error)
            } else if (info && info.data && info.data.status == 1) {
                alert("success")
            } else if (info.data.status == 2) {
                console.log("pending...")
                loopQuery(serialNumberP)
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function call(funcP, argsP) {
    var source = "n1ZNBpKGq6ffBjbUZR22terqWvenXzcdzZq"//dappContactAddress this may be code source
    var nvm = new NVM(block, transaction);
    var func = funcP
    var args = argsP
    try {
        var result = nvm.call(source, func, args);
        if (result === undefined) {
            result = "call success!"
        }
        if (typeof result === "object") {
            result = JSON.stringify(result);
            $("#title").text(result.title);
            $('#content').text("正文:  " + result.content);
            $('#author').text("作者：" + result.author);
        }
    } catch (e) {
        $('#content').text("异常: " + e);
    }
}