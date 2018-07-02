var web3 = require('../web3');
var config = AppConfig.web3;

var names = require('./packageNames.json').PackageNames

var Package = function() {
    this.contracts = [];
    let data, contract, type_addrs;
    for(let i = 0; i < names.length; i++) {
        this.contracts.push([]);

        for(let j = 0; j < names[i].length; j++) {
            this.contracts[i].push([]);

            for(let k = 0; k < names[i][j].length; k++) {
                data = require('./config/' + names[i][j][k] + '.json');
                contract = web3.eth.contract(data.abi).at(data.networks[config.networks].address);
                this.contracts[i][j].push(contract);
            }
        }
    }
}

Package.prototype.typeNum = function() {
    return this.contracts.length;
}

Package.prototype.campNumOfType = function(type) {
    return this.contracts[type].length;
}

Package.prototype.packageNumOfCamp = function(type, n) {
    return this.contracts[type][n].length;
}

Package.prototype.getPackageCard = function(type, n, camp, callback) {
    let contract = this.contracts[type][n][camp];
    if(contract == null) {
        return;
    }

    let j = 0
    let cards = {};
    let cateNum = 0;
    contract.cardCateNum((err, result) => {
        if (err) {
            callback(err);
        } else {
            cateNum = result.toNumber();
            let cates = []
            let batch = web3.createBatch();
            for(let i = 0; i < cateNum; i++) {
                let request = contract.cardCate.request(i, (err, cate) => {
                    if (err) {
                        callback(err);
                    } else {
                        cards[cate.toString()] = 0;
                        cates[i] = cate.toString();
                    }
                });
                request.params.push('latest');
                batch.add(request);

                request = contract.cardRemainNum.request(i, (err, cnt) => {
                    if (err) {
                        callback(err);
                    } else {
                        if (cates[i] == null) {
                            callback(new Error("do not has cate" + i));
                        } else {
                            cards[cates[i]] = cnt.toNumber();
                            if (cates.length == cateNum) {
                                callback(null, cards);
                            }
                        }
                    }
                });
                request.params.push('latest');
                batch.add(request);
            }
            batch.execute();
        }
    })

}

var package = new Package();

module.exports = package;