let request = require('request');
let fs = require('fs');

let Nebulas = require('nebulas');
let neb = new Nebulas.Neb();

let nonce = 0;
let nu = 1;

let current_account = null;

const COMPILED_FILE_PATH = '../contract/TheSecret.js';
const DEPLOYED_DATA_FILE_PATH = './deployed.json';

let src = fs.readFileSync(COMPILED_FILE_PATH, 'utf8');
let deployed_data = { deployed: [] };

const CHAIN_ID = 1001;
const NODE_URL = "https://testnet.nebulas.io"//"http://192.168.1.59:8685";
const PASS_PHRASE = "passphrase";
const ACCOUNT_ZZH6 = {
    "version": 4,
    "id": "53959b99-83f9-4fea-b9e5-7cd53d44df07",
    "address": "n1GxMyqCzawSTeN2DmfqrHbybTzeQZN5UxR",
    "crypto": {
        "ciphertext": "e61f72f06258eb245e8a3e479325831dffebc9635cd6ffb3083f98407ada9fce",
        "cipherparams": {
            "iv": "3e66f7c744912059a25771a2040a9b9d"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "fb948e5bdf6aab195321f9b4bc9d97d4afbf0f92f30bc4ce45e05fbf6ad22cad",
            "n": 4096,
            "r": 8,
            "p": 1
        },
        "mac": "5ebdf6e657e2c443721169a01d1221bb70d92b2b425742079d39798523adba2a",
        "machash": "sha3256"
    }
}

//
neb.setRequest(new Nebulas.HttpRequest(NODE_URL));

current_account = Nebulas.Account.fromAddress(ACCOUNT_ZZH6.address);
current_account.fromKey(ACCOUNT_ZZH6, PASS_PHRASE);
current_account.getAddressString();

function loadDeployedData() {
    fs.access(DEPLOYED_DATA_FILE_PATH, err => {
        if (!err) {
            deployed_data = JSON.parse(fs.readFileSync(DEPLOYED_DATA_FILE_PATH, 'utf8'));
        }
    });
}

loadDeployedData();

function getAccountStatus(account, callback) {
    let options = {
        url: NODE_URL + '/v1/user/accountstate',
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: { "address": account }
    };
    request(options, (err, response, body) => {
        console.assert(err == null, err);
        console.log("account status:", body);
        nonce = parseInt(body.result.nonce) + 1;
        console.log('nonce: ' + nonce);
        callback();
    });
}

function unlockAccount(account, passphrase, callback) {
    let options = {
        url: NODE_URL + '/v1/admin/account/unlock',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        json: true,
        body: { "address": account, "passphrase": passphrase, "duration": "43200000000000" }
    };

    request(options, (err, response, body) => {
        console.assert(err == null, err);
        console.log("unlock account:", body);

        callback();
    });
}

function callContract(account, callback) {
    let param = {
        "from": account,
        "to": account,
        "value": 0,
        "nonce": nonce,
        "gasPrice": 1000000,
        "gasLimit": 2000000,
        "contract": {
            "source": src,
            "sourceType": "ts",
            "args": ""
        }
    };

    neb.api.call(param).then(function (resp) {
        console.log("verify Contract:", resp);

        if (callback) {
            callback(resp);
        }
    }).catch(function (err) {
        console.log(err);
    });

    // let options = {
    //     url: NODE_URL + '/v1/user/call',
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     json: true,
    //     body: param
    // };
    //
    // request(options, (err, response, body) => {
    //     console.assert(err == null, err);
    //     console.log("verify Contract:", body);
    //
    //     if (callback && JSON.parse(body.result.result) == "") {
    //         callback();
    //     }
    // });
}

function deploy(account, passphrase) {
    let params = {
        from: account,
        to: account,
        value: 0,
        nonce: nonce,
        gasPrice: 10000000,
        gasLimit: 50000000,
        contract: {
            source: src,
            sourceType: "js",
            args: ""
        }
    };

    let gTx = new Nebulas.Transaction(CHAIN_ID,
        current_account,
        params.to, params.value, params.nonce, params.gasPrice, params.gasLimit, params.contract);
    gTx.signTransaction();
    neb.api.sendRawTransaction(gTx.toProtoString())
        .then(result => {
            console.log("deploy contract: ", result);
            checkingDeployment(result.txhash);
        })
        .catch(err => {
            console.error(err);
        });

    // let options = {
    //     url: NODE_URL + '/v1/admin/transactionWithPassphrase',
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     json: true,
    //     body: param
    // };

    // request(options, (err, response, body) => {
    //     console.assert(err == null, err);
    //     console.log("deploy contract:", body);

    //     checkingDeployment(body.result.txhash);
    // });
}

function checkingDeployment(txhash) {
    let options = {
        url: NODE_URL + '/v1/user/getTransactionReceipt',
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        json: true,
        body: { "hash": txhash }
    };

    request(options, (err, response, body) => {
        console.assert(err == null, err);
        if (body.result) {
            body.result.data = 'REMOVED!!!!';
        }

        console.log(nu++ + " checking deployment:", body);

        if (body.error || body.result.status == 2) {
            setTimeout(() => {
                checkingDeployment(txhash);
            }, 5000);
        } else if (body.result.status == 1) {
            deployed_data.deployed.push({ txhash: body.result.hash, address: body.result.contract_address });
            fs.writeFileSync(DEPLOYED_DATA_FILE_PATH, JSON.stringify(deployed_data));
        }
    });
}

function verifyContract() {

    getAccountStatus(ACCOUNT_ZZH6.address, () => {
        unlockAccount(ACCOUNT_ZZH6.address, PASS_PHRASE, () => {
            callContract(ACCOUNT_ZZH6.address);
        });
    });

}

function deployContract() {
    getAccountStatus(ACCOUNT_ZZH6.address, () => {
        unlockAccount(ACCOUNT_ZZH6.address, PASS_PHRASE, () => {
            callContract(ACCOUNT_ZZH6.address, (result) => {
                if (result.execute_err != "") {
                    process.nextTick(deployContract);
                } else {
                    deploy(ACCOUNT_ZZH6.address, PASS_PHRASE);
                }
            });
        });
    });
}

// verifyContract();

deployContract();

// checkingDeployment('a639263da966235e2fcca785e75bac4d02ca371f9368adcd89cc353d0a313619');
// checkingDeployment('8c046139df48e0c39e5910b9e9ade24214426b09b099c6fe135411e4013593fa');

