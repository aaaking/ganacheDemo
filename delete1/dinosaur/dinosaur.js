"use strict";
exports.__esModule = true;
var EventDef = (function () {
    function EventDef() { }
    return EventDef;
}());
EventDef.EggBirth = "EggBirth";
EventDef.DinosaurHatched = "DinosaurHatched";
EventDef.Transfer = "Transfer";
EventDef.Approval = "Approval";
EventDef.HatchingEgg = "HatchingEgg";
EventDef.Pregnant = "Pregnant";
EventDef.StartSeeking = "StartSeeking";
EventDef.TrophiesCollected = "TrophiesCollected";
EventDef.AuctionCreated = "AuctionCreated";
EventDef.AuctionSuccessful = "AuctionSuccessful";
EventDef.AuctionCancelled = "AuctionCancelled";
EventDef.BattleResult = "BattleResult";
EventDef.UseHonor = "UseHonor";

function AssertThrow(condition, prompt) {
    if (!condition) {
        console.warn(arguments);
        throw new Error(arguments);
    }
}

function assert(condition, prompt) {
    if (!condition) {
        console.warn(prompt ? prompt : JSON.stringify(condition));
    }
}

function address(addr) {
    if (typeof addr === "number") {
        return addr.toString();
    }
    return addr;
}

function nowInSeconds() {
    return (Date.now() / 1000);
}
var bind_number = {
    stringify: function (obj) {
        return obj.toString();
    },
    parse: function (str) {
        return parseInt(str);
    }
};
var bind_address = {
    stringify: function (obj) {
        return obj.toString();
    },
    parse: function (str) {
        return str;
    }
};
var bind_bool = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return (str === "true") ? true : false;
    }
};
var bind_dnsrtoken = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return new DNSRToken(JSON.parse(str));
    }
};
var bind_dinosauregg = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return new DinosaurEgg(JSON.parse(str));
    }
};
var bind_dinosaur = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return new Dinosaur(JSON.parse(str));
    }
};
var bind_battlegroup = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return new BattleGroup(JSON.parse(str));
    }
};
var bind_auction = {
    stringify: function (obj) {
        return JSON.stringify(obj);
    },
    parse: function (str) {
        return new Auction(JSON.parse(str));
    }
};

function randBetween(_lower, _upper) {
    return Math.floor((Math.random() * (_upper - _lower) + _lower));
}
var Permission = (function () {
    function Permission() { }
    Permission.decorator = function () {
        var funcs = arguments;
        if (funcs.length < 1) {
            throw new Error("Permission decorator need parameters");
        }
        return function () {
            for (var i = 0; i < funcs.length - 1; i++) {
                var func = funcs[i];
                if (typeof func !== "function") {
                    throw new Error("Permission decorator failure");
                } else if (!func()) {
                    throw new Error("Function return false");
                }
            }
            var exeFunc = funcs[funcs.length - 1];
            if (typeof exeFunc === "function") {
                exeFunc.apply(this, arguments);
            } else {
                throw new Error("Permission decorator need an executable method");
            }
        };
    };
    Permission.onlyCEO = function () {
        console.log("Blockchain.transaction.from ", Blockchain.transaction.from, " ceo address ", ControlCenter.instance.ceoAddress);
        return (Blockchain.transaction.from == ControlCenter.instance.ceoAddress);
    };
    Permission.onlyCTO = function () {
        return (Blockchain.transaction.from == ControlCenter.instance.ctoAddress || Blockchain.transaction.from == ControlCenter.instance.ceoAddress);
    };
    Permission.onlyCFO = function () {
        console.log("Blockchain.transaction.from ", Blockchain.transaction.from, " cfo address ", ControlCenter.instance.cfoAddress);
        return (Blockchain.transaction.from == ControlCenter.instance.cfoAddress || Blockchain.transaction.from == ControlCenter.instance.ceoAddress);
    };
    Permission.onlyCOO = function () {
        console.log("Blockchain.transaction.from ", Blockchain.transaction.from, " cfo address ", ControlCenter.instance.cooAddress);
        return (Blockchain.transaction.from == ControlCenter.instance.cooAddress || Blockchain.transaction.from == ControlCenter.instance.ceoAddress);
    };
    Permission.onlySYS = function () {
        return (Blockchain.transaction.from == ControlCenter.instance.sysAddress || Blockchain.transaction.from == ControlCenter.instance.ceoAddress);
    };
    Permission.onlyCLevel = function () {
        return (Blockchain.transaction.from == ControlCenter.instance.ceoAddress ||
            Blockchain.transaction.from == ControlCenter.instance.ctoAddress ||
            Blockchain.transaction.from == ControlCenter.instance.cfoAddress ||
            Blockchain.transaction.from == ControlCenter.instance.cooAddress);
    };
    Permission.Payable = function () {
        if (Blockchain.transaction.value.gt(0)) {
            return true;
        }
        return false;
    };
    Permission.whenNotPaused = function () {
        return (!ControlCenter.instance.paused);
    };
    Permission.whenCanUpdateChainData = function () {
        return (ControlCenter.instance.paused && ControlCenter.instance.pauseCt == 1);
    };
    Permission.whenPaused = function () {
        return (ControlCenter.instance.paused);
    };
    return Permission;
}());
var ControlCenter = (function () {
    function ControlCenter() {
        console.log("*********ControlCenter constructor********");
        LocalContractStorage.defineProperty(this, "paused");
        LocalContractStorage.defineProperty(this, "pauseCt", bind_number);
        LocalContractStorage.defineProperty(this, "ceoAddress");
        LocalContractStorage.defineProperty(this, "ctoAddress");
        LocalContractStorage.defineProperty(this, "cfoAddress");
        LocalContractStorage.defineProperty(this, "cooAddress");
        LocalContractStorage.defineProperty(this, "sysAddress");
    }
    Object.defineProperty(ControlCenter, "instance", {
        get: function () {
            if (ControlCenter._instance == null) {
                ControlCenter._instance = new ControlCenter();
            }
            return ControlCenter._instance;
        },
        enumerable: true,
        configurable: true
    });
    ControlCenter.prototype.initCLevelAddreses = function () {
        console.log("deploy owner: ", Blockchain.transaction.from);
        ControlCenter.instance.paused = false;
        ControlCenter.instance.pauseCt = 0;
        ControlCenter.instance.ceoAddress = Blockchain.transaction.from;
        ControlCenter.instance.ctoAddress = Blockchain.transaction.from;
        ControlCenter.instance.cfoAddress = Blockchain.transaction.from;
        ControlCenter.instance.cooAddress = Blockchain.transaction.from;
        ControlCenter.instance.sysAddress = Blockchain.transaction.from;
    };
    return ControlCenter;
}());
ControlCenter._instance = null;
var Gene = (function () {
    function Gene() { }
    return Gene;
}());
var Nature = (function () {
    function Nature(parameters) {
        parameters = parameters || {};
        this.strength = parseInt(parameters.strength || 0);
        this.intelligence = parseInt(parameters.intelligence || 0);
        this.agile = parseInt(parameters.agile || 0);
        this.lucky = parseInt(parameters.lucky || 0);
    }
    return Nature;
}());
var NatureAddon = (function () {
    function NatureAddon(parameters) {
        parameters = parameters || {};
        this.strength = parseInt(parameters.strength || 0);
        this.intelligence = parseInt(parameters.intelligence || 0);
        this.agile = parseInt(parameters.agile || 0);
        this.lucky = parseInt(parameters.lucky || 0);
    }
    return NatureAddon;
}());
var PairNature = (function () {
    function PairNature() { }
    return PairNature;
}());
var GeneticAlgorithm = (function () {
    function GeneticAlgorithm() {
        this.KIND1_MASK = 0x3E0;
        this.KIND2_MASK = 0x01F;
    }
    Object.defineProperty(GeneticAlgorithm, "instance", {
        get: function () {
            if (GeneticAlgorithm._instance == null) {
                GeneticAlgorithm._instance = new GeneticAlgorithm();
            }
            return GeneticAlgorithm._instance;
        },
        enumerable: true,
        configurable: true
    });
    GeneticAlgorithm.prototype.getStrength = function (_natureF, _natureM, _natureAddon) {
        var gene0 = Math.max(_natureF.strength.gene0, _natureM.strength.gene0);
        return 1000 - gene0 + _natureAddon.strength;
    };
    GeneticAlgorithm.prototype.getAgile = function (_natureF, _natureM, _natureAddon) {
        var gene0 = Math.max(_natureF.agile.gene0, _natureM.agile.gene0);
        return 1000 - gene0 + _natureAddon.agile;
    };
    GeneticAlgorithm.prototype.getIntelligence = function (_natureF, _natureM, _natureAddon) {
        var gene0 = Math.max(_natureF.intelligence.gene0, _natureM.intelligence.gene0);
        return 1000 - gene0 + _natureAddon.intelligence;
    };
    GeneticAlgorithm.prototype.getLucky = function (_natureF, _natureM, _natureAddon) {
        var gene0 = Math.max(_natureF.lucky.gene0, _natureM.lucky.gene0);
        return 1000 - gene0 + _natureAddon.lucky;
    };
    GeneticAlgorithm.prototype.buildKind = function (_motherKind, _fatherKind) {
        var rand1 = randBetween(0, 100);
        var rand2 = randBetween(0, 100);
        var kind1 = rand1 > 50 ? (_motherKind & this.KIND1_MASK) >> 5 : (_motherKind & this.KIND2_MASK);
        var kind2 = rand2 > 50 ? (_fatherKind & this.KIND1_MASK) >> 5 : (_fatherKind & this.KIND2_MASK);
        return (kind1 << 5 | kind2);
    };
    GeneticAlgorithm.prototype.buildHatchCDIndex = function (_min, _max, _generation) {
        var min = Math.min(7, Math.ceil((_generation || 0) / _min));
        return randBetween(min, _max);
    };
    GeneticAlgorithm.prototype.inheritedGenes = function (_motherNatureF, _motherNatureM, _fatherNatureF, _fatherNatureM, _natureAddonF, _natureAddonM) {
        var pairNature = new PairNature();
        var rand1 = randBetween(0, 100);
        var rand2 = randBetween(0, 100);
        var usedNatureM = rand1 > 50 ? _motherNatureF : _motherNatureM;
        var usedNatureF = rand2 > 50 ? _fatherNatureF : _fatherNatureM;
        pairNature.natureF = this._inheritedOneGenes(usedNatureM, _natureAddonM);
        pairNature.natureM = this._inheritedOneGenes(usedNatureF, _natureAddonF);
        return pairNature;
    };
    GeneticAlgorithm.prototype._inheritedOneGenes = function (_nature, _natureAddon) {
        var newNature = new Nature();
        var heredityValue = randBetween(100, 131);
        newNature.strength = this._inheritedSingleAttribute(_nature.strength, _natureAddon.strength, heredityValue, false);
        newNature.intelligence = this._inheritedSingleAttribute(_nature.intelligence, _natureAddon.intelligence, heredityValue, false);
        newNature.agile = this._inheritedSingleAttribute(_nature.agile, _natureAddon.agile, heredityValue, false);
        newNature.lucky = this._inheritedSingleAttribute(_nature.lucky, _natureAddon.lucky, heredityValue, true);
        return newNature;
    };
    GeneticAlgorithm.prototype._inheritedSingleAttribute = function (_genes, acquired, _randValue, _isLucky) {
        var newGene = new Gene();
        newGene.gene0 = Math.max(1, _genes.gene0 - (acquired * randBetween(10, 20) / 100));
        newGene.gene1 = this._inheritedSignleGene(_genes.gene1, _randValue);
        newGene.gene2 = this._inheritedSignleGene(_genes.gene2, _randValue);
        if (!_isLucky) {
            newGene.gene3 = this._inheritedSignleGene(_genes.gene3, _randValue);
            newGene.gene4 = this._inheritedSignleGene(_genes.gene4, _randValue);
            newGene.gene5 = this._inheritedSignleGene(_genes.gene5, _randValue);
        }
        return newGene;
    };
    GeneticAlgorithm.prototype._inheritedSignleGene = function (_gene, _randValue) {
        var gene = Math.max((_gene >> 1) * _randValue / 100, 1);
        gene = Math.min(gene, 999);
        return (gene << 1 | _gene & 0x01);
    };
    GeneticAlgorithm.prototype.calcBreedingIndex = function (generationF, generationM, maxIndex) {
        return Math.min((generationF + generationM) / 2, maxIndex);
    };
    GeneticAlgorithm.prototype.buildGen0Genes = function () {
        var pairNature = new PairNature();
        pairNature.natureF = this._buildOneGenes();
        pairNature.natureM = this._buildOneGenes();
        return pairNature;
    };
    GeneticAlgorithm.prototype.buildGee0Kind = function () {
        var kind1 = randBetween(1, 5) << 1 | randBetween(0, 2);
        var kind2 = randBetween(1, 5) << 1 | randBetween(0, 2);
        return (kind1 << 5 | kind2);
    };
    GeneticAlgorithm.prototype._buildOneGenes = function () {
        var nature = new Nature();
        nature.strength = this._buildSingleAttribute(false);
        nature.intelligence = this._buildSingleAttribute(false);
        nature.agile = this._buildSingleAttribute(false);
        nature.lucky = this._buildSingleAttribute(true);
        return nature;
    };
    GeneticAlgorithm.prototype._buildSingleAttribute = function (_isLucky) {
        var gene0 = randBetween(1, 1000);
        var rand1 = randBetween(1, 1000);
        var rand2 = randBetween(1, 1000);
        var rand3 = randBetween(1, 1000);
        var rand4 = randBetween(1, 1000);
        var rand5 = randBetween(1, 1000);
        var hideOrShowBounds = randBetween(1, 1000);
        var ratioStart = 0;
        var ratioEnd = 1;
        if (gene0 <= 50) {
            ratioStart = 1;
            ratioEnd = 21;
        } else if (gene0 <= 150) {
            ratioStart = 2;
            ratioEnd = 27;
        } else if (gene0 <= 300) {
            ratioStart = 3;
            ratioEnd = 33;
        } else if (gene0 <= 600) {
            ratioStart = 4;
            ratioEnd = 39;
        } else if (gene0 <= 1000) {
            ratioStart = 5;
            ratioEnd = 45;
        }
        var genetic = new Gene();
        genetic.gene0 = gene0;
        genetic.gene1 = this._packSingleGene(ratioStart, ratioEnd, rand1, hideOrShowBounds);
        genetic.gene2 = this._packSingleGene(ratioStart, ratioEnd, rand2, hideOrShowBounds);
        if (!_isLucky) {
            genetic.gene3 = this._packSingleGene(ratioStart, ratioEnd, rand3, hideOrShowBounds);
            genetic.gene4 = this._packSingleGene(ratioStart, ratioEnd, rand4, hideOrShowBounds);
            genetic.gene5 = this._packSingleGene(ratioStart, ratioEnd, rand5, hideOrShowBounds);
        }
        return genetic;
    };
    GeneticAlgorithm.prototype._packSingleGene = function (ratioStart, ratioEnd, randValue, hideOrShowBounds) {
        var gene = this._calcGeneValueByRatio(ratioStart, ratioEnd, randValue);
        return (gene << 1 | (randValue > hideOrShowBounds ? 1 : 0));
    };
    GeneticAlgorithm.prototype._calcGeneValueByRatio = function (_start, _end, _randValue) {
        var id = _start;
        var ratio = _start;
        while (ratio <= _end) {
            if (_randValue <= 1000 * ratio / _end) {
                break;
            }
            id++;
            ratio += id;
        }
        var value = (id - 1) * 100 + (_randValue % 100) + 1;
        return value;
    };
    return GeneticAlgorithm;
}());
GeneticAlgorithm._instance = null;
var Auction = (function () {
    function Auction(parameters) {
        parameters = parameters || {};
        this.seller = parameters.seller || address(0);
        this.startingPrice = parseFloat(parameters.startingPrice || 0);
        this.endingPrice = parseFloat(parameters.endingPrice || 0);
        this.duration = parseInt(parameters.duration || 0);
        this.startedAt = parseInt(parameters.startedAt || 0);
    }
    return Auction;
}());
var SaleDutchAuction = (function () {
    function SaleDutchAuction() {
        this.address = "n1MAAK3Znv6WUwzE3HUKZ3twNoJX1YET22M";
        this.setCut = Permission.decorator(Permission.onlyCFO, function (_cut) {
            _cut = parseInt(_cut);
            AssertThrow(_cut <= 1000);
            this.ownerCut = _cut;
        });
        this.IS_SALEDUTCHAUCTION = true;
        this.bid = Permission.decorator(Permission.Payable, function (_tokenId) {
            var auction = this._getAuctionFromMap(_tokenId);
            AssertThrow(auction);
            var seller = auction.seller;
            AssertThrow(seller);
            console.log("_bid: amount: ", Blockchain.transaction.value);
            var price = this._bid(_tokenId, Blockchain.transaction.value);
            this.nftEggContract.transfer(Blockchain.transaction.from, _tokenId, this.address);
            if (seller == this.nftEggContract.address) {
                var index = this.gen0SaleCount % 5;
                this.lastGen0SalePrices.set(index.toString(), price);
                this.gen0SaleCount++;
            }
        });
        console.log("*********SaleDutchAuction constructor********");
        if (SaleDutchAuction._instance) {
            throw new Error("only one sale auction instance allowed!");
        }
        LocalContractStorage.defineProperty(this, "ownerCut", bind_number);
        LocalContractStorage.defineMapProperty(this, "tokenIdToAuction", bind_auction);
        LocalContractStorage.defineProperty(this, "gen0SaleCount", bind_number);
        LocalContractStorage.defineMapProperty(this, "lastGen0SalePrices", bind_number);
    }
    Object.defineProperty(SaleDutchAuction, "instance", {
        get: function () {
            if (SaleDutchAuction._instance == null) {
                SaleDutchAuction._instance = new SaleDutchAuction();
            }
            return SaleDutchAuction._instance;
        },
        enumerable: true,
        configurable: true
    });
    SaleDutchAuction.prototype._getAuctionFromMap = function (key) {
        var auction = this.tokenIdToAuction.get("sale_" + key.toString());
        return auction || new Auction();
    };
    SaleDutchAuction.prototype._saveAuctionToMap = function (key, tokenIdToAuction) {
        this.tokenIdToAuction.set("sale_" + key.toString(), tokenIdToAuction);
    };
    SaleDutchAuction.prototype._removeAuctionFromMap = function (key) {
        this.tokenIdToAuction.del("sale_" + key.toString());
    };
    SaleDutchAuction.prototype._addAuction = function (_tokenId, _auction) {
        this._saveAuctionToMap(_tokenId, _auction);
        Event.Trigger(EventDef.AuctionCreated, {
            result: [_tokenId, _auction.startingPrice, _auction.startingPrice, _auction.endingPrice, _auction.duration]
        });
    };
    SaleDutchAuction.prototype._cancelAuction = function (_tokenId, _seller) {
        AssertThrow(Blockchain.transaction.from == _seller);
        this._removeAuctionFromMap(_tokenId);
        Event.Trigger(EventDef.AuctionCancelled, {
            result: [_tokenId]
        });
    };
    SaleDutchAuction.prototype._bid = function (_tokenId, _bidAmount) {
        _bidAmount = parseInt(_bidAmount.toString(10));
        var auction = this._getAuctionFromMap(_tokenId);
        AssertThrow(this._isOnAuction(auction));
        var price = this._currentPrice(auction);
        AssertThrow(_bidAmount >= price);
        var seller = auction.seller;
        this._removeAuctionFromMap(_tokenId);
        console.log("_bid price: ", seller, price, _bidAmount.toString());
        if (price > 0 && seller != this.nftEggContract.address && seller != address(0)) {
            var auctioneerCut = this._cut(price);
            var sellerReturn = price - auctioneerCut;
            console.log("_bid: ", seller, sellerReturn, price, _bidAmount);
            Blockchain.transfer(seller, sellerReturn.toString());
        }
        Event.Trigger(EventDef.AuctionSuccessful, {
            result: [_tokenId, price, Blockchain.transaction.from]
        });
        return price;
    };
    SaleDutchAuction.prototype._isOnAuction = function (_auction) {
        return (_auction.startedAt > 0);
    };
    SaleDutchAuction.prototype._currentPrice = function (_auction) {
        var secondsPassed = 0;
        var now = nowInSeconds();
        if (now > _auction.startedAt) {
            secondsPassed = now - _auction.startedAt;
        }
        if (secondsPassed >= _auction.duration) {
            return _auction.endingPrice;
        } else {
            var totalPriceChange = _auction.endingPrice - _auction.startingPrice;
            console.log("\n>>>>>sale current price", _auction.endingPrice, _auction.startingPrice, totalPriceChange);
            var currentPriceChange = totalPriceChange * secondsPassed / _auction.duration;
            return _auction.startingPrice + currentPriceChange;
        }
    };
    SaleDutchAuction.prototype._cut = function (_price) {
        return _price * this.ownerCut / 10000;
    };
    SaleDutchAuction.prototype.setAuction = function (tokenid, auction) {
        this.tokenIdToAuction.set("sale_" + tokenid.toString(), auction);
    };
    SaleDutchAuction.prototype.createAuction = function (_tokenId, _startingPrice, _endingPrice, _duration, _seller) {
        console.log("createAuction: ", _tokenId, _startingPrice, _endingPrice, _duration, _seller);
        _tokenId = parseInt(_tokenId);
        _startingPrice = parseFloat(_startingPrice);
        _endingPrice = parseFloat(_endingPrice);
        _duration = parseInt(_duration);
        AssertThrow(_startingPrice > _endingPrice, "starting price > ending price");
        this.nftEggContract.transferFrom(_seller, this.address, _tokenId);
        var auction = new Auction({
            seller: _seller,
            startingPrice: _startingPrice,
            endingPrice: _endingPrice,
            duration: _duration,
            startedAt: nowInSeconds()
        });
        this._addAuction(_tokenId, auction);
    };
    SaleDutchAuction.prototype.cancelAuction = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        AssertThrow(this._isOnAuction(auction));
        AssertThrow(Blockchain.transaction.from == auction.seller, Blockchain.transaction.from, auction.seller);
        this.nftEggContract.transfer(auction.seller, _tokenId, this.address);
        this._cancelAuction(_tokenId, auction.seller);
    };
    SaleDutchAuction.prototype.getAuction = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        return auction;
    };
    SaleDutchAuction.prototype.getCurrentPrice = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        AssertThrow(this._isOnAuction(auction));
        return this._currentPrice(auction);
    };
    SaleDutchAuction.prototype.setNFTEggContract = function (candidateContract) {
        AssertThrow(candidateContract.implementsERC721());
        this.nftEggContract = candidateContract;
    };
    SaleDutchAuction.prototype.averageGen0SalePrice = function () {
        var sum = 0;
        for (var i = 0; i < 5; i++) {
            sum += this.lastGen0SalePrices.get(i.toString()) || 0;
        }
        return sum / 5;
    };
    return SaleDutchAuction;
}());
SaleDutchAuction._instance = null;
var SiringDutchAuction = (function () {
    function SiringDutchAuction() {
        this.address = "n1ZQ5sKfTtA5pdMVJMnP34y6h194QF8HAuB";
        this.setCut = Permission.decorator(Permission.onlyCFO, function (_cut) {
            _cut = parseInt(_cut);
            AssertThrow(_cut <= 1000);
            this.ownerCut = _cut;
        });
        this.IS_SIRINGDUTCHAUCTION = true;
        this.bid = Permission.decorator(Permission.Payable, function (_tokenId) {
            var _seller = this._getAuctionFromMap(_tokenId).seller;
            AssertThrow(_seller);
            this._bid(_tokenId, Blockchain.transaction.value);
            this.nftEggContract.transfer(_seller, _tokenId, this.address);
        });
        console.log("*********SiringDutchAuction constructor********");
        if (SiringDutchAuction._instance) {
            throw new Error("only one siring auction instance allowed!");
        }
        LocalContractStorage.defineProperty(this, "ownerCut", bind_number);
        LocalContractStorage.defineMapProperty(this, "tokenIdToAuction", bind_auction);
    }
    Object.defineProperty(SiringDutchAuction, "instance", {
        get: function () {
            if (SiringDutchAuction._instance == null) {
                SiringDutchAuction._instance = new SiringDutchAuction();
            }
            return SiringDutchAuction._instance;
        },
        enumerable: true,
        configurable: true
    });
    SiringDutchAuction.prototype._getAuctionFromMap = function (key) {
        var auction = this.tokenIdToAuction.get("siring_" + key.toString());
        return auction || new Auction();
    };
    SiringDutchAuction.prototype._saveAuctionToMap = function (key, tokenIdToAuction) {
        this.tokenIdToAuction.set("siring_" + key.toString(), tokenIdToAuction);
    };
    SiringDutchAuction.prototype._removeAuctionFromMap = function (key) {
        this.tokenIdToAuction.del("siring_" + key.toString());
    };
    SiringDutchAuction.prototype._addAuction = function (_tokenId, _auction) {
        this._saveAuctionToMap(_tokenId, _auction);
        Event.Trigger("AuctionCreated", {
            result: [_tokenId, _auction.startingPrice, _auction.endingPrice, _auction.duration]
        });
    };
    SiringDutchAuction.prototype._cancelAuction = function (_tokenId, _seller) {
        AssertThrow(Blockchain.transaction.from == _seller);
        this._removeAuctionFromMap(_tokenId);
        Event.Trigger(EventDef.AuctionCancelled, {
            result: [_tokenId]
        });
    };
    SiringDutchAuction.prototype._bid = function (_tokenId, _bidAmount) {
        _bidAmount = parseInt(_bidAmount.toString(10));
        var auction = this._getAuctionFromMap(_tokenId);
        console.log("\n>>>>_bid: auction", JSON.stringify(auction));
        AssertThrow(this._isOnAuction(auction));
        var price = this._currentPrice(auction);
        console.log("\n>>>>_bid, amount and price", _bidAmount, price);
        AssertThrow(_bidAmount >= price);
        var seller = auction.seller;
        this._removeAuctionFromMap(_tokenId);
        if (price > 0 && seller != this.nftEggContract.address && seller != address(0)) {
            var auctioneerCut = this._cut(price);
            var sellerReturn = price - auctioneerCut;
            console.log("\n>>>>_bid", sellerReturn, price, auctioneerCut);
            Blockchain.transfer(seller, sellerReturn.toString());
        }
        Event.Trigger(EventDef.AuctionSuccessful, {
            result: [_tokenId, price, Blockchain.transaction.from]
        });
        return price;
    };
    SiringDutchAuction.prototype._isOnAuction = function (_auction) {
        return (_auction.startedAt > 0);
    };
    SiringDutchAuction.prototype._currentPrice = function (_auction) {
        var secondsPassed = 0;
        var now = nowInSeconds();
        if (now > _auction.startedAt) {
            secondsPassed = now - _auction.startedAt;
        }
        if (secondsPassed >= _auction.duration) {
            return _auction.endingPrice;
        } else {
            var totalPriceChange = _auction.endingPrice - _auction.startingPrice;
            var currentPriceChange = totalPriceChange * secondsPassed / _auction.duration;
            return _auction.startingPrice + currentPriceChange;
        }
    };
    SiringDutchAuction.prototype._cut = function (_price) {
        return _price * this.ownerCut / 10000;
    };
    SiringDutchAuction.prototype.setAuction = function (tokenid, auction) {
        this.tokenIdToAuction.set("siring_" + tokenid.toString(), auction);
    };
    SiringDutchAuction.prototype.createAuction = function (_tokenId, _startingPrice, _endingPrice, _duration, _seller) {
        _tokenId = parseInt(_tokenId);
        _startingPrice = parseFloat(_startingPrice);
        _endingPrice = parseFloat(_endingPrice);
        _duration = parseInt(_duration);
        AssertThrow((_startingPrice > _endingPrice), "starting price < ending price");
        this.nftEggContract.transferFrom(_seller, this.address, _tokenId);
        var auction = new Auction({
            seller: _seller,
            startingPrice: _startingPrice,
            endingPrice: _endingPrice,
            duration: _duration,
            startedAt: nowInSeconds()
        });
        this._addAuction(_tokenId, auction);
    };
    SiringDutchAuction.prototype.cancelAuction = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        AssertThrow(this._isOnAuction(auction));
        AssertThrow(Blockchain.transaction.from == auction.seller);
        this.nftEggContract.transfer(auction.seller, _tokenId, this.address);
        this._cancelAuction(_tokenId, auction.seller);
    };
    SiringDutchAuction.prototype.getAuction = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        return auction;
    };
    SiringDutchAuction.prototype.getCurrentPrice = function (_tokenId) {
        var auction = this._getAuctionFromMap(_tokenId);
        AssertThrow(this._isOnAuction(auction));
        return this._currentPrice(auction);
    };
    SiringDutchAuction.prototype.setNFTEggContract = function (candidateContract) {
        AssertThrow(candidateContract.implementsERC721());
        this.nftEggContract = candidateContract;
    };
    return SiringDutchAuction;
}());
SiringDutchAuction._instance = null;
var DNSRToken = (function () {
    function DNSRToken(parameters) {
        this.kind = parseInt(parameters.kind || 0);
        this.motherId = parseInt(parameters.motherId || 0);
        this.fatherId = parseInt(parameters.fatherId || 0);
        this.generation = parseInt(parameters.generation || 0);
        this.phase = parseInt(parameters.phase || 0);
    }
    return DNSRToken;
}());
var DinosaurEgg = (function () {
    function DinosaurEgg(parameters) {
        this.birthTime = parseInt(parameters.birthTime || 0);
        this.hatchEndTime = parseInt(parameters.hatchEndTime || 0);
        this.hatchCDIndex = parseInt(parameters.hatchCDIndex || 0);
        this.natureF = parameters.natureF;
        this.natureM = parameters.natureM;
    }
    return DinosaurEgg;
}());
var Dinosaur = (function () {
    function Dinosaur(parameters) {
        this.birthTime = parseInt(parameters.birthTime || 0);
        this.seekingCDEndTime = parseInt(parameters.seekingCDEndTime || 0);
        this.breedingCDEndTime = parseInt(parameters.breedingCDEndTime || 0);
        this.seekingCDIndex = parseInt(parameters.seekingCDIndex || 0);
        this.breedingCDIndex = parseInt(parameters.breedingCDIndex || 0);
        this.siringWithId = parseInt(parameters.siringWithId || 0);
        this.attributes = parseInt(parameters.attributes || 0);
        this.winCt = parseInt(parameters.winCt || 0);
        this.battleCt = parseInt(parameters.battleCt || 0);
        this.isBattling = parseInt(parameters.isBattling || 0);
        this.agileAddon = parseInt(parameters.agileAddon || 0);
        this.strengthAddon = parseInt(parameters.strengthAddon || 0);
        this.luckyAddon = parseInt(parameters.luckyAddon || 0);
        this.intelligenceAddon = parseInt(parameters.intelligenceAddon || 0);
        this.rankPos = parseInt(parameters.rankPos || 0);
    }
    return Dinosaur;
}());
var BattleGroup = (function () {
    function BattleGroup(parameters) {
        this.indexs = parameters.indexs || [];
        this.owner = parameters.owner || "";
        this.pos = parameters.pos || 0;
        this.dnsrCt = parameters.dnsrCt || 0;
    }
    return BattleGroup;
}());
var Jurassic = (function () {
    function Jurassic() {
        this.address = "n1QwibyGUSBkuR2897pcmfsoSgH2KyQN4S3";
        this.enableUnitTest = Permission.decorator(Permission.onlyCTO, function (flag) {
            this.unit_test = flag;
            if (this.unit_test) {
                this.cooldowns[0] = 1;
            } else {
                this.cooldowns[0] = 60;
            }
        });
        this.COOLDOWN_TABLE_SIZE = 14;
        this.cooldowns = [
            60,
            120,
            300,
            600,
            1800,
            3600,
            7200,
            14400,
            28800,
            57600,
            86400,
            172800,
            345600,
            604800
        ];
        this.SEEKING_CD_INDEX = 7;
        this.MAX_PLEASURE = 10;
        this.PLEASURE_MASK = 0xFFFF;
        this.MAX_IDS = 400000000;
        this.MAX_GENERATION = 65535;
        this.EGG_PHASE = 1;
        this.DINOSAUR_PHASE = 2;
        this.DINOSAUR_ACTION_FREE = 0;
        this.DINOSAUR_ACTION_BREEDING = 1;
        this.DINOSAUR_ACTION_AUCTION = 2;
        this.DINOSAUR_ACTION_SEEKING = 3;
        this.SetTotalSupply = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (lastTokenId) {
            this.lastTokenId = lastTokenId;
        });
        this.SetOwnershipDinosaurCount = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (_owners, _cts) {
            AssertThrow(_owners.length == _cts.length);
            for (var i in _owners) {
                this.ownershipDinosaurCount.set(_owners[i], _cts[i]);
            }
        });
        this.SetDinosaurIndexToOwner = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenids, owners) {
            AssertThrow(tokenids.length == owners.length);
            for (var i in tokenids) {
                this.dinosaurIndexToOwner.set(tokenids[i].toString(), owners[i]);
            }
        });
        this.approve = Permission.decorator(Permission.whenNotPaused, function (_to, _tokenId) {
            AssertThrow(this._owns(Blockchain.transaction.from, _tokenId));
            console.log("\napprove", _to, _tokenId);
            this.dinosaurIndexToApproved.set(_tokenId.toString(), _to);
            Event.Trigger("Approval", {
                result: [Blockchain.transaction.from, _to, _tokenId]
            });
        });
        this.transferFrom = Permission.decorator(Permission.whenNotPaused, function (_from, _to, _tokenId) {
            var approved_addr = this.dinosaurIndexToApproved.get(_tokenId.toString());
            console.log("\nTransferFrom", approved_addr, _from, _to, _tokenId, SaleDutchAuction.instance.address);
            AssertThrow(approved_addr == SaleDutchAuction.instance.address || approved_addr == SiringDutchAuction.instance.address);
            AssertThrow(this._owns(_from, _tokenId));
            this._transfer(_from, _to, _tokenId);
        });
        this.transfer = Permission.decorator(Permission.whenNotPaused, function (_to, _tokenId, _contract) {
            var from = address("0");
            if (_contract) {
                AssertThrow(_contract == SaleDutchAuction.instance.address || _contract == SiringDutchAuction.instance.address);
                from = _contract;
            } else {
                from = Blockchain.transaction.from;
            }
            AssertThrow(this._owns(from, _tokenId), Blockchain.transaction.from, _tokenId);
            this._transfer(from, _to, _tokenId);
        });
        this.transferTo = Permission.decorator(Permission.whenNotPaused, function (_to, _tokenId) {
            this.transfer(_to, _tokenId, null);
        });
        this.PROMOCREATIONLIMIT = 50000;
        this.GEN0CREATIONLIMIT = 100000;
        this.createAllPromoEgg = Permission.decorator(Permission.onlyCOO, function (_owner, _ct) {
            if (_owner == Blockchain.transaction.from) {
                _owner = ControlCenter.instance.cooAddress;
            }
            AssertThrow(_owner.length <= 20);
            AssertThrow(_owner.length == _ct.length);
            for (var i in _owner) {
                var own = _owner[i];
                var ct = _ct[i];
                AssertThrow(this.promoCreatedCount + ct < this.PROMOCREATIONLIMIT);
                for (var ct_index = 0; ct_index < ct; ct_index++) {
                    var pairNature = GeneticAlgorithm.instance.buildGen0Genes();
                    var _hatchCDIndex = GeneticAlgorithm.instance.buildHatchCDIndex(2, 6);
                    var kind = GeneticAlgorithm.instance.buildGee0Kind();
                    this._createEgg(kind, 0, 0, 0, pairNature.natureF, pairNature.natureM, _hatchCDIndex, own);
                }
                this.promoCreatedCount += ct;
            }
        });
        this.createPromoEgg = Permission.decorator(Permission.onlyCOO, function (_kind, _owner) {
            if (_owner == Blockchain.transaction.from) {
                _owner = ControlCenter.instance.cooAddress;
            }
            AssertThrow(this.promoCreatedCount < this.PROMOCREATIONLIMIT);
            this.promoCreatedCount++;
            var pairNature = GeneticAlgorithm.instance.buildGen0Genes();
            var _hatchCDIndex = GeneticAlgorithm.instance.buildHatchCDIndex(2, 6);
            _kind = parseInt(_kind);
            var kind = _kind << 6 | _kind << 1;
            this._createEgg(kind, 0, 0, 0, pairNature.natureF, pairNature.natureM, _hatchCDIndex, _owner);
        });
        this.setSireAllowedToAddress = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenIds, owners) {
            AssertThrow(tokenIds.length == owners.length);
            for (var i in tokenIds) {
                this.sireAllowedToAddress.set(tokenIds[i].toString(), owners[i]);
            }
        });
        this.setSeekingCut = Permission.decorator(Permission.onlyCFO, function (_cut) {
            _cut = parseInt(_cut);
            this._seekingTax = _cut;
        });
        this.createSaleAuction = Permission.decorator(Permission.whenNotPaused, function (_tokenId, _startingPrice, _endingPrice, _duration) {
            console.log("\n>>>create sale auction", _startingPrice, _endingPrice);
            AssertThrow(this._owns(Blockchain.transaction.from, _tokenId), Blockchain.transaction.from, _tokenId);
            AssertThrow(this._isDinosaurInFree(_tokenId));
            var owner = this.dinosaurIndexToOwner.get(_tokenId.toString());
            this.dinosaurIndexToApproved.set(_tokenId.toString(), SaleDutchAuction.instance.address);
            var durationLimit = 60;
            if (this.unit_test) {
                durationLimit = 1;
            }
            AssertThrow(_duration >= durationLimit, "duration >= 60");
            SaleDutchAuction.instance.createAuction(_tokenId, _startingPrice, _endingPrice, _duration, owner);
        });
        this.createGen0SaleAuction = Permission.decorator(Permission.whenNotPaused, Permission.onlyCOO, function (_startingPrice, _endingPrice, _duration) {
            var _newId = this._createGen0Egg(this.address);
            this.dinosaurIndexToApproved.set(_newId.toString(), SaleDutchAuction.instance.address);
            var durationLimit = 60;
            if (this.unit_test) {
                durationLimit = 1;
            }
            AssertThrow(_duration >= durationLimit, "duration >= 60");
            SaleDutchAuction.instance.createAuction(_newId, _startingPrice, _endingPrice, _duration, this.address);
        });
        this.createSiringAuction = Permission.decorator(Permission.whenNotPaused, function (_tokenId, _startingPrice, _endingPrice, _duration) {
            AssertThrow(this._owns(Blockchain.transaction.from, _tokenId), Blockchain.transaction.from, _tokenId);
            AssertThrow(this._isReadyToBreed(_tokenId));
            var durationLimit = 60;
            if (this.unit_test) {
                durationLimit = 1;
            }
            AssertThrow(_duration >= durationLimit, "duration >= 60");
            var owner = this.dinosaurIndexToOwner.get(_tokenId.toString());
            this.dinosaurIndexToApproved.set(_tokenId.toString(), SiringDutchAuction.instance.address);
            SiringDutchAuction.instance.createAuction(_tokenId, _startingPrice, _endingPrice, _duration, owner);
        });
        this.bidOnSiringAuction = Permission.decorator(Permission.Payable, Permission.whenNotPaused, function (_motherId, _fatherId) {
            AssertThrow(this._owns(Blockchain.transaction.from, _motherId));
            var price = SiringDutchAuction.instance.getCurrentPrice(_fatherId);
            var bidAmount = parseInt(Blockchain.transaction.value.toString(10));
            AssertThrow(bidAmount >= price);
            AssertThrow(this._isReadyToBreed(_motherId));
            AssertThrow(this._isReadyToBreed(_fatherId));
            SiringDutchAuction.instance.bid(_fatherId);
            this._approveSiring(Blockchain.transaction.from, _fatherId);
            this._breedWith(_motherId, _fatherId);
        });
        this.setSiringCut = Permission.decorator(Permission.onlyCFO, function (_cut) {
            SiringDutchAuction.instance.setCut(_cut);
        });
        this.setSaleCut = Permission.decorator(Permission.onlyCFO, function (_cut) {
            _cut = parseInt(_cut);
            SaleDutchAuction.instance.setCut(_cut);
        });
        this.SetDNSRTokenToMap = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenids, tokens) {
            console.log("SetDNSRTokenToMap ", tokenids.length);
            AssertThrow(tokenids.length == tokens.length);
            for (var i in tokenids) {
                this.dnsrToken.set(tokenids[i].toString(), new DNSRToken(JSON.parse(tokens[i])));
                this.dnsrTokenSize++;
            }
        });
        this.SetDinosaurEggToMap = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenids, eggs) {
            console.log("SetDinosaurEggToMap ", tokenids.length);
            AssertThrow(tokenids.length == eggs.length);
            for (var i in tokenids) {
                this.eggs.set(tokenids[i].toString(), new DinosaurEgg(JSON.parse(eggs[i])));
                this.eggsSize++;
            }
        });
        this.SetDinosaurToMap = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenids, dinosaurs) {
            console.log("SetDinosaurToMap ", tokenids.length);
            AssertThrow(tokenids.length == dinosaurs.length);
            for (var i in tokenids) {
                this.dinosaurs.set(tokenids[i].toString(), new Dinosaur(JSON.parse(dinosaurs[i])));
                this.dinosaursSize++;
            }
        });
        this.SetBattleGroup = Permission.decorator(Permission.whenNotPaused, function (battlelist) {
            console.log(battlelist);
            AssertThrow(battlelist.length <= 10);
            var owner = Blockchain.transaction.from;
            var ct = 0;
            for (var _i = 0, battlelist_1 = battlelist; _i < battlelist_1.length; _i++) {
                var i = battlelist_1[_i];
                if (i != 0) {
                    AssertThrow(this._isDinosaurInFree(i));
                    var dinosaurOwner = this.dinosaurIndexToOwner.get(i.toString());
                    AssertThrow(owner == dinosaurOwner);
                    var dinosaur = this._getDinosaurFromMap(i);
                    console.log(dinosaur);
                    AssertThrow(dinosaur.birthTime != 0 && dinosaur.attributes >= 6);
                    dinosaur.isBattling = 1;
                    this.dinosaurs.set(i.toString(), dinosaur);
                    ct++;
                }
            }
            AssertThrow(ct != 0);
            AssertThrow(Blockchain.transaction.value.gte(ct * 10000000000000000), Blockchain.transaction.value.toString(10));
            this.battleGroupMapSize++;
            this.battleGroupTotalSize++;
            this.battleGroupMap.set(owner, new BattleGroup({
                indexs: battlelist,
                owner: owner,
                pos: this.battleGroupTotalSize,
                dnsrCt: ct
            }));
            this.battleGroupArray.set(this.battleGroupTotalSize.toString(), owner);
        });
        this.cancleBattle = Permission.decorator(Permission.whenNotPaused, function () {
            this._cancleBattle(Blockchain.transaction.from);
        });
        this.BattleFight = Permission.decorator(Permission.whenNotPaused, Permission.onlyCOO, function () {
            AssertThrow(this.battleGroupMapSize >= 2);
            var battlePair = this._getBattlePair();
            console.log("battle pair ", battlePair);
            AssertThrow(battlePair.length == 2);
            var left = battlePair[0];
            var leftowner = this.battleGroupArray.get(left.toString());
            var right = battlePair[1];
            var rightowner = this.battleGroupArray.get(right.toString());
            console.log(left, right, leftowner, rightowner);
            var leftGroup = this.battleGroupMap.get(leftowner);
            var rightGroup = this.battleGroupMap.get(rightowner);
            console.log(leftGroup, rightGroup);
            AssertThrow(leftGroup.indexs.length != 0 && rightGroup.indexs.length != 0);
            console.log(leftGroup, rightGroup);
            var honor = this._fight(leftGroup, rightGroup);
            this.battleGroupMap.del(leftowner);
            this.battleGroupMap.del(rightowner);
            this.battleGroupArray.del(left.toString());
            this.battleGroupArray.del(right.toString());
            this.battleGroupMapSize -= 2;
            Event.Trigger(EventDef.BattleResult, {
                result: [leftowner, rightowner, honor]
            });
        });
        this.BattleEnd = Permission.decorator(Permission.whenNotPaused, Permission.onlyCOO, function () {
            for (var i = 1; i <= this.battleGroupTotalSize; i++) {
                var address_1 = this.battleGroupArray.get(i.toString());
                if (address_1) {
                    this._cancleBattle(address_1);
                }
            }
            this.battleGroupTotalSize = 0;
        });
        this.startHatchingEgg = Permission.decorator(Permission.whenNotPaused, function (_id) {
            console.log("\n>>>startHatchingEgg", Blockchain.transaction.value);
            AssertThrow(Blockchain.transaction.value.gte(10000000000000000));
            AssertThrow(this._owns(Blockchain.transaction.from, _id));
            var _dnsrToken = this._getDNSRTokenFromMap(_id);
            AssertThrow(_dnsrToken.phase == this.EGG_PHASE);
            var _own = Blockchain.transaction.from;
            var hatchEndTime = this._startHatchingEgg(_id);
            Event.Trigger(EventDef.HatchingEgg, {
                result: [_own, _id, hatchEndTime]
            });
        });
        this.breedWith = Permission.decorator(Permission.whenNotPaused, function (_motherId, _fatherId) {
            AssertThrow(this._owns(Blockchain.transaction.from, _motherId));
            AssertThrow(Blockchain.transaction.value.gte(5000000000000000));
            AssertThrow(this.canBreedWith(_motherId, _fatherId));
            this._breedWith(_motherId, _fatherId);
        });
        this.tryToLayTheEgg = Permission.decorator(Permission.whenNotPaused, function (_motherId) {
            _motherId = parseInt(_motherId);
            var _motherToken = this._getDNSRTokenFromMap(_motherId);
            AssertThrow(this.isEggReadyToLay(_motherId), "not ready to lay out egg", _motherId);
            var _motherDinosaur = this._getDinosaurFromMap(_motherId);
            var _fatherId = _motherDinosaur.siringWithId;
            AssertThrow(_fatherId != 0);
            var _fatherToken = this._getDNSRTokenFromMap(_fatherId);
            var generation = Math.max(_motherToken.generation, _fatherToken.generation);
            generation++;
            var _eggM = this._getDinosaurEggFromMap(_motherId);
            var _eggF = this._getDinosaurEggFromMap(_fatherId);
            var _fatherDinosaur = this._getDinosaurFromMap(_fatherId);
            var _natureAddonF = new NatureAddon({
                strength: _fatherDinosaur.strengthAddon,
                intelligence: _fatherDinosaur.intelligenceAddon,
                agile: _fatherDinosaur.agileAddon,
                lucky: _fatherDinosaur.luckyAddon
            });
            var _natureAddonM = new NatureAddon({
                strength: _motherDinosaur.strengthAddon,
                intelligence: _motherDinosaur.intelligenceAddon,
                agile: _motherDinosaur.agileAddon,
                lucky: _motherDinosaur.luckyAddon
            });
            var _pairNature = GeneticAlgorithm.instance.inheritedGenes(_eggM.natureF, _eggM.natureM, _eggF.natureF, _eggF.natureM, _natureAddonF, _natureAddonM);
            var _owner = this.dinosaurIndexToOwner.get(_motherId.toString());
            var kind = GeneticAlgorithm.instance.buildKind(_motherToken.kind, _fatherToken.kind);
            var _hatchCDIndex = GeneticAlgorithm.instance.buildHatchCDIndex(2, 7);
            this._createEgg(kind, _motherId, _fatherId, generation, _pairNature.natureF, _pairNature.natureM, _hatchCDIndex, _owner);
            _motherDinosaur.siringWithId = 0;
            this._saveDinosaurToMap(_motherId, _motherDinosaur);
        });
        this.tryToBirthFromEgg = Permission.decorator(Permission.whenNotPaused, function (_eggId) {
            _eggId = parseInt(_eggId);
            AssertThrow(this.isDinosaurReadyToHatched(_eggId), "not ready to hatch", _eggId);
            var _dnsrToken = this._getDNSRTokenFromMap(_eggId);
            var _dnsrTokenF = this._getDNSRTokenFromMap(_dnsrToken.fatherId);
            var _dnsrTokenM = this._getDNSRTokenFromMap(_dnsrToken.motherId);
            var _breedingCDIndex = GeneticAlgorithm.instance.calcBreedingIndex(_dnsrTokenF.generation, _dnsrTokenM.generation, this.COOLDOWN_TABLE_SIZE - 1);
            this._hatched(_eggId, this.MAX_PLEASURE, this.SEEKING_CD_INDEX, _breedingCDIndex);
        });
        this.seeking = Permission.decorator(Permission.whenNotPaused, function (_id) {
            AssertThrow(this._owns(Blockchain.transaction.from, _id));
            var tax = this.getSeekingTax();
            var value = parseInt(Blockchain.transaction.value.toString(10));
            AssertThrow(value >= tax);
            AssertThrow(this.isReadyForSeeking(_id));
            this.seekingIndexToOwner.set(_id.toString(), Blockchain.transaction.from);
            this._startSeeking(_id);
            var _dinosaur = this._getDinosaurFromMap(_id);
            if ((_dinosaur.attributes & this.PLEASURE_MASK) < 6) {
                _dinosaur.attributes += 4;
            } else {
                _dinosaur.attributes = this.MAX_PLEASURE;
            }
            this._saveDinosaurToMap(_id, _dinosaur);
        });
        this.setSaleAuction = Permission.decorator(Permission.onlyCTO, function (tokenids, auctions) {
            AssertThrow(tokenids.length == auctions.length);
            console.log("setSaleAuction ", tokenids, auctions);
            for (var i in tokenids) {
                SaleDutchAuction.instance.setAuction(tokenids[i], new Auction(JSON.parse(auctions[i])));
            }
        });
        this.setSiriAuction = Permission.decorator(Permission.onlyCTO, function (tokenids, auctions) {
            AssertThrow(tokenids.length == auctions.length);
            console.log("setSiriAuction ", tokenids, auctions);
            for (var i in tokenids) {
                SiringDutchAuction.instance.setAuction(tokenids[i], new Auction(JSON.parse(auctions[i])));
            }
        });
        this.collectSeekingTrophies = Permission.decorator(Permission.whenNotPaused, function (_id) {
            _id = parseInt(_id);
            AssertThrow(_id <= this.MAX_IDS);
            AssertThrow(this.isReadyToBackHome(_id));
            var _dinosaur = this._getDinosaurFromMap(_id);
            this._createTrophies(_id, _dinosaur.attributes);
            _dinosaur.seekingCDEndTime = 0;
            this._saveDinosaurToMap(_id, _dinosaur);
            this.seekingIndexToOwner.del(_id.toString());
        });
        this.SetSeekingOwner = Permission.decorator(Permission.whenCanUpdateChainData, Permission.onlyCTO, function (tokenIds, owners) {
            AssertThrow(tokenIds.length == owners.length);
            for (var i in tokenIds) {
                this.seekingIndexToOwner.set(tokenIds[i].toString(), owners[i]);
            }
        });
        this.saveNickname = Permission.decorator(Permission.whenNotPaused, Permission.onlyCOO, function (tokenId, nickname) {
            AssertThrow(nickname.length < 8, nickname);
            this.dinosuarNickname.set(tokenId.toString(), nickname);
        });
        this.pause = Permission.decorator(Permission.onlyCLevel, Permission.whenNotPaused, function () {
            ControlCenter.instance.paused = true;
            ControlCenter.instance.pauseCt++;
        });
        this.unpause = Permission.decorator(Permission.onlyCTO, Permission.whenPaused, function () {
            ControlCenter.instance.paused = false;
        });
        this.withdrawBalance = Permission.decorator(Permission.onlyCFO, function (value) {
            value = new BigNumber(value);
            console.log("withdrawBalance ", value);
            Blockchain.transfer(ControlCenter.instance.cfoAddress, value.toString());
        });
        this.setCEO = Permission.decorator(Permission.onlyCEO, function (_newCEO) {
            AssertThrow(_newCEO != address(0));
            ControlCenter.instance.ceoAddress = _newCEO;
        });
        this.setCTO = Permission.decorator(Permission.onlyCEO, function (_newCTO) {
            AssertThrow(_newCTO != address(0));
            ControlCenter.instance.ctoAddress = _newCTO;
        });
        this.setCFO = Permission.decorator(Permission.onlyCEO, function (_newCFO) {
            AssertThrow(_newCFO != address(0));
            ControlCenter.instance.cfoAddress = _newCFO;
        });
        this.setCOO = Permission.decorator(Permission.onlyCEO, function (_newCOO) {
            AssertThrow(_newCOO != address(0));
            ControlCenter.instance.cooAddress = _newCOO;
        });
        this.setSYS = Permission.decorator(Permission.onlyCEO, function (_newSYS) {
            AssertThrow(_newSYS != address(0));
            ControlCenter.instance.sysAddress = _newSYS;
        });
        console.log("*********Jurassic constructor********");
        console.log("SaleDutchAuction.instance.gen0SaleCount", SaleDutchAuction.instance.gen0SaleCount);
        console.log("SiringDutchAuction.instance.ownerCut", SiringDutchAuction.instance.ownerCut);
        LocalContractStorage.defineProperty(this, "unit_test", bind_bool);
        LocalContractStorage.defineMapProperty(this, "ownershipDinosaurCount", bind_number);
        LocalContractStorage.defineMapProperty(this, "playerHonor", bind_number);
        LocalContractStorage.defineMapProperty(this, "playerUseHonorCt", bind_number);
        LocalContractStorage.defineProperty(this, "lastTokenId", bind_number);
        LocalContractStorage.defineProperty(this, "dnsrTokenSize", bind_number);
        LocalContractStorage.defineMapProperty(this, "dnsrToken", bind_dnsrtoken);
        LocalContractStorage.defineProperty(this, "eggsSize", bind_number);
        LocalContractStorage.defineMapProperty(this, "eggs", bind_dinosauregg);
        LocalContractStorage.defineProperty(this, "dinosaursSize", bind_number);
        LocalContractStorage.defineMapProperty(this, "dinosaurs", bind_dinosaur);
        LocalContractStorage.defineMapProperty(this, "dinosaurIndexToOwner", bind_address);
        LocalContractStorage.defineMapProperty(this, "dinosaurIndexToApproved", bind_address);
        LocalContractStorage.defineMapProperty(this, "sireAllowedToAddress", bind_address);
        LocalContractStorage.defineMapProperty(this, "seekingIndexToOwner", bind_address);
        LocalContractStorage.defineProperty(this, "promoCreatedCount", bind_number);
        LocalContractStorage.defineProperty(this, "gen0CreatedCount", bind_number);
        LocalContractStorage.defineProperty(this, "_seekingTax");
        LocalContractStorage.defineMapProperty(this, "dinosuarNickname", bind_address);
        LocalContractStorage.defineProperty(this, "battleGroupTotalSize", bind_number);
        LocalContractStorage.defineProperty(this, "battleGroupMapSize", bind_number);
        LocalContractStorage.defineMapProperty(this, "battleGroupArray", bind_address);
        LocalContractStorage.defineMapProperty(this, "battleGroupMap", bind_battlegroup);
        LocalContractStorage.defineMapProperty(this, "battleRankMap", bind_dinosaur);
        LocalContractStorage.defineProperty(this, "battleRankSize", bind_number);
        SaleDutchAuction.instance.setNFTEggContract(this);
        SiringDutchAuction.instance.setNFTEggContract(this);
    }
    Jurassic.prototype._getDinosaurPhase = function (_id) {
        var _dnsrToken = this._getDNSRTokenFromMap(_id.toString());
        return _dnsrToken.phase;
    };
    Jurassic.prototype._transfer = function (_from, _to, _tokenId) {
        var count = this.ownershipDinosaurCount.get(_to);
        this.ownershipDinosaurCount.set(_to, ++count);
        this.dinosaurIndexToOwner.set(_tokenId.toString(), _to);
        console.log("transfer", count, _from, _to, _tokenId, this.dinosaurIndexToOwner.get(_tokenId.toString()), _from != address(0));
        if (_from != address(0)) {
            var count_1 = this.ownershipDinosaurCount.get(_from);
            this.ownershipDinosaurCount.set(_from, --count_1);
            this.dinosaurIndexToApproved.del(_tokenId.toString());
            this.sireAllowedToAddress.del(_tokenId.toString());
        }
        Event.Trigger(EventDef.Transfer, {
            result: [_from, _to, _tokenId]
        });
    };
    Jurassic.prototype._createEgg = function (_kind, _motherId, _fatherId, _generation, _natureF, _natureM, _hatchCDIndex, _owner) {
        _kind = parseInt(_kind);
        _motherId = parseInt(_motherId);
        _fatherId = parseInt(_fatherId);
        _generation = parseInt(_generation);
        _hatchCDIndex = parseInt(_hatchCDIndex);
        AssertThrow(_motherId <= this.MAX_IDS, _motherId, this.MAX_IDS);
        AssertThrow(_fatherId <= this.MAX_IDS, _fatherId, this.MAX_IDS);
        AssertThrow(_generation <= this.MAX_GENERATION, "_generation <= this.MAX_GENERATION");
        var _dnsrToken = new DNSRToken({
            kind: _kind,
            motherId: _motherId,
            fatherId: _fatherId,
            generation: _generation,
            phase: this.EGG_PHASE
        });
        this.lastTokenId++;
        this._saveDNSRTokenToMap(this.lastTokenId, _dnsrToken);
        var _newTokenId = this.lastTokenId;
        AssertThrow(_newTokenId <= this.MAX_IDS, _newTokenId, this.MAX_IDS);
        var _egg = new DinosaurEgg({
            birthTime: Blockchain.block.timestamp,
            hatchEndTime: 0,
            hatchCDIndex: this.unit_test ? 0 : _hatchCDIndex,
            natureF: _natureF,
            natureM: _natureM
        });
        this._saveDinosaurEggToMap(_newTokenId, _egg);
        this._transfer(address(0), _owner, _newTokenId);
        Event.Trigger(EventDef.EggBirth, {
            result: [_owner, _newTokenId, _motherId, _fatherId, _egg.natureF, _egg.natureM]
        });
        return _newTokenId;
    };
    Jurassic.prototype._hatched = function (_eggId, _attr, _seekingCDIndex, _breedingCDIndex) {
        var _dnsrToken = this._getDNSRTokenFromMap(_eggId.toString());
        AssertThrow(_dnsrToken.phase == this.EGG_PHASE, "_dnsrToken.phase == this.EGG_PHASE");
        _dnsrToken.phase = this.DINOSAUR_PHASE;
        this._saveDNSRTokenToMap(_eggId, _dnsrToken);
        var _dinosaur = new Dinosaur({
            birthTime: nowInSeconds(),
            seekingCDEndTime: 0,
            breedingCDEndTime: 0,
            seekingCDIndex: this.unit_test ? 0 : _seekingCDIndex,
            breedingCDIndex: this.unit_test ? 0 : _breedingCDIndex,
            siringWithId: 0,
            attributes: _attr
        });
        console.log("\n>>>>hatch", JSON.stringify(_dinosaur));
        this._saveDinosaurToMap(_eggId, _dinosaur);
        var _owner = this.dinosaurIndexToOwner.get(_eggId.toString());
        Event.Trigger(EventDef.DinosaurHatched, {
            result: [_owner, _eggId]
        });
    };
    Jurassic.prototype._isDinosaurInFree = function (_id) {
        var _dinosaur = this._getDinosaurFromMap(_id);
        if (!_dinosaur) {
            return true;
        }
        if (_dinosaur.siringWithId > 0) {
            return false;
        }
        if (_dinosaur.breedingCDEndTime > nowInSeconds()) {
            return false;
        }
        var owner = this.seekingIndexToOwner.get(_id.toString()) || address(0);
        if (owner != address(0)) {
            return false;
        }
        owner = this.ownerOf(_id);
        if (owner == SaleDutchAuction.instance.address || owner == SiringDutchAuction.instance.address) {
            return false;
        }
        if (_dinosaur.isBattling) {
            return false;
        }
        return true;
    };
    Jurassic.prototype._owns = function (_claimant, _tokenId) {
        console.log("_owns: ", this.dinosaurIndexToOwner.get(_tokenId.toString()), _claimant);
        return (this.dinosaurIndexToOwner.get(_tokenId.toString()) == _claimant);
    };
    Jurassic.prototype.implementsERC721 = function () {
        return true;
    };
    Jurassic.prototype.name = function () {
        return "CryptoDinosaur";
    };
    Jurassic.prototype.symbol = function () {
        return "DNSR";
    };
    Jurassic.prototype.totalSupply = function () {
        return this.lastTokenId;
    };
    Jurassic.prototype.balanceOf = function (_owner) {
        console.log("balanceOf", _owner, this.ownershipDinosaurCount.get(_owner));
        return this.ownershipDinosaurCount.get(_owner) || 0;
    };
    Jurassic.prototype.ownerOf = function (_tokenId) {
        var _owner = this.dinosaurIndexToOwner.get(_tokenId.toString());
        console.log("ownerOf", _owner, _tokenId);
        return _owner || address(0);
    };
    Jurassic.prototype.tokenOfOwnerByIndex = function (_owner, _index) {
        var count = 0;
        var total = this.totalSupply();
        for (var i = 1; i <= total; i++) {
            if (this.dinosaurIndexToOwner.get(i) == _owner) {
                if (count == _index) {
                    return i;
                } else {
                    count++;
                }
            }
        }
    };
    Jurassic.prototype._createGen0Egg = function (_owner) {
        var pairNature = GeneticAlgorithm.instance.buildGen0Genes();
        var _kind = GeneticAlgorithm.instance.buildGee0Kind();
        var _hatchCDIndex = GeneticAlgorithm.instance.buildHatchCDIndex(1, 5);
        var _newId = this._createEgg(_kind, 0, 0, 0, pairNature.natureF, pairNature.natureM, _hatchCDIndex, _owner);
        this.gen0CreatedCount++;
        return _newId;
    };
    Jurassic.prototype._startHatchingEgg = function (_id) {
        var _egg = this._getDinosaurEggFromMap(_id.toString());
        AssertThrow(_egg.hatchEndTime == 0);
        _egg.hatchEndTime = nowInSeconds() + this.cooldowns[_egg.hatchCDIndex];
        this._saveDinosaurEggToMap(_id, _egg);
        console.log("\n>>>_startHatchingEgg: ", _egg.hatchEndTime, nowInSeconds(), this.cooldowns[_egg.hatchCDIndex]);
        return _egg.hatchEndTime;
    };
    Jurassic.prototype._triggerBreedingCooldown = function (_dinosaur) {
        _dinosaur.breedingCDEndTime = nowInSeconds() + this.cooldowns[_dinosaur.breedingCDIndex];
        if (_dinosaur.breedingCDIndex < (this.COOLDOWN_TABLE_SIZE - 1)) {
            _dinosaur.breedingCDIndex++;
            if (this.unit_test) {
                _dinosaur.breedingCDIndex = 0;
            }
        }
    };
    Jurassic.prototype._isReadyToBreed = function (_tokenId) {
        var _dinosaur = this._getDinosaurFromMap(_tokenId.toString());
        var owner = this.ownerOf(_tokenId);
        if (owner != SiringDutchAuction.instance.address) {
            AssertThrow(this._isDinosaurInFree(_tokenId));
        }
        AssertThrow(_dinosaur.siringWithId == 0);
        AssertThrow(this._getDinosaurPhase(_tokenId) == this.DINOSAUR_PHASE);
        return true;
    };
    Jurassic.prototype._canBreedWith = function (_motherId, _fatherId) {
        AssertThrow(_motherId != _fatherId);
        AssertThrow(this._isReadyToBreed(_motherId));
        AssertThrow(this._isReadyToBreed(_fatherId));
        var motherOwner = this.dinosaurIndexToOwner.get(_motherId.toString());
        var fatherOwner = this.dinosaurIndexToOwner.get(_fatherId.toString());
        return (motherOwner == fatherOwner || this.sireAllowedToAddress.get(_fatherId.toString()) == motherOwner);
    };
    Jurassic.prototype._breedWith = function (_motherId, _fatherId) {
        var _dinosaurM = this._getDinosaurFromMap(_motherId.toString());
        var _dinosaurF = this._getDinosaurFromMap(_fatherId.toString());
        AssertThrow((_dinosaurM.attributes & this.PLEASURE_MASK) >= 4, (_dinosaurM.attributes & this.PLEASURE_MASK), _dinosaurM.attributes, this.PLEASURE_MASK);
        _dinosaurM.siringWithId = _fatherId;
        this._triggerBreedingCooldown(_dinosaurM);
        this._triggerBreedingCooldown(_dinosaurF);
        this.sireAllowedToAddress.del(_motherId.toString());
        this.sireAllowedToAddress.del(_fatherId.toString());
        if ((_dinosaurF.attributes & this.PLEASURE_MASK) < 10) {
            _dinosaurF.attributes += 1;
        }
        _dinosaurM.attributes -= 4;
        this._saveDinosaurToMap(_motherId, _dinosaurM);
        this._saveDinosaurToMap(_fatherId, _dinosaurF);
        Event.Trigger(EventDef.Pregnant, {
            result: [this.dinosaurIndexToOwner.get(_motherId.toString()), _motherId, _fatherId]
        });
    };
    Jurassic.prototype._approveSiring = function (_addr, _fatherId) {
        this.sireAllowedToAddress.set(_fatherId.toString(), _addr);
    };
    Jurassic.prototype.getSireAllowedAddress = function (tokenId) {
        return this.sireAllowedToAddress.get(tokenId.toString());
    };
    Jurassic.prototype.getSeekingCut = function () {
        return this._seekingTax;
    };
    Jurassic.prototype._triggerSeekingCooldown = function (_dinosaur) {
        _dinosaur.seekingCDEndTime = nowInSeconds() + this.cooldowns[_dinosaur.seekingCDIndex];
        console.log("\n>>>_triggerSeekingCooldown", _dinosaur.seekingCDEndTime, nowInSeconds() + this.cooldowns[_dinosaur.seekingCDIndex]);
    };
    Jurassic.prototype._startSeeking = function (_id) {
        var _dinosaur = this._getDinosaurFromMap(_id);
        this._triggerSeekingCooldown(_dinosaur);
        this._saveDinosaurToMap(_id, _dinosaur);
        var _owner = this.dinosaurIndexToOwner.get(_id.toString());
        Event.Trigger(EventDef.StartSeeking, {
            result: [_owner, _id]
        });
    };
    Jurassic.prototype._createTrophies = function (_id, _attr) {
        var _owner = this.dinosaurIndexToOwner.get(_id.toString());
        _attr = 1;
        var _rand = randBetween(1, 101);
        if (_rand <= 55) {
            var honor = this.playerHonor.get(_owner);
            this.playerHonor.set(_owner, honor + 10);
            Event.Trigger(EventDef.TrophiesCollected, {
                result: [_owner, 10, 0, 2]
            });
        } else if (_rand <= 90) {
            var honor = this.playerHonor.get(_owner);
            var rewardHonor = randBetween(50, 400);
            this.playerHonor.set(_owner, honor + rewardHonor);
            Event.Trigger(EventDef.TrophiesCollected, {
                result: [_owner, rewardHonor, 0, 2]
            });
        } else {
            var _newEggId = this._createGen0Egg(_owner);
            var _kindIndex = 0;
            var _categoryIndex = 0;
            Event.Trigger(EventDef.TrophiesCollected, {
                result: [_owner, _newEggId, _kindIndex, _categoryIndex]
            });
        }
    };
    Jurassic.prototype.getSiringCut = function () {
        return SiringDutchAuction.instance.ownerCut;
    };
    Jurassic.prototype.cancelSiringAuction = function (_tokenId) {
        SiringDutchAuction.instance.cancelAuction(_tokenId);
    };
    Jurassic.prototype.getSiringAuction = function (_tokenId) {
        return SiringDutchAuction.instance.getAuction(_tokenId);
    };
    Jurassic.prototype.getCurrentSiringPrice = function (_tokenId) {
        return SiringDutchAuction.instance.getCurrentPrice(_tokenId);
    };
    Jurassic.prototype.bidOnSaleAuction = function (_tokenId) {
        SaleDutchAuction.instance.bid(_tokenId);
    };
    Jurassic.prototype.getSaleCut = function () {
        return SaleDutchAuction.instance.ownerCut;
    };
    Jurassic.prototype.cancelSaleAuction = function (_tokenId) {
        SaleDutchAuction.instance.cancelAuction(_tokenId);
    };
    Jurassic.prototype.getSaleAuction = function (_tokenId) {
        return SaleDutchAuction.instance.getAuction(_tokenId);
    };
    Jurassic.prototype.getCurrentSalePrice = function (_tokenId) {
        return SaleDutchAuction.instance.getCurrentPrice(_tokenId);
    };
    Jurassic.prototype.getAverageGen0SalePrice = function () {
        return SaleDutchAuction.instance.averageGen0SalePrice();
    };
    Jurassic.prototype.GetDNSRTokenToMapSize = function () {
        return this.dnsrTokenSize;
    };
    Jurassic.prototype._getDNSRTokenFromMap = function (key) {
        return this.dnsrToken.get(key.toString()) || new DNSRToken({});
    };
    Jurassic.prototype._saveDNSRTokenToMap = function (key, dnsrToken) {
        this.dnsrToken.set(key.toString(), dnsrToken);
    };
    Jurassic.prototype.GetDinosaurEggToMapSize = function () {
        return this.eggsSize;
    };
    Jurassic.prototype._getDinosaurEggFromMap = function (key) {
        return this.eggs.get(key.toString()) || new DinosaurEgg({});
    };
    Jurassic.prototype._saveDinosaurEggToMap = function (key, eggs) {
        this.eggs.set(key.toString(), eggs);
    };
    Jurassic.prototype.GetDinosaurToMapSize = function () {
        return this.dinosaursSize;
    };
    Jurassic.prototype._getDinosaurFromMap = function (key) {
        return this.dinosaurs.get(key.toString()) || new Dinosaur({});
    };
    Jurassic.prototype._saveDinosaurToMap = function (key, dinosaurs) {
        this.dinosaurs.set(key.toString(), dinosaurs);
    };
    Jurassic.prototype.init = function () {
        this.lastTokenId = -1;
        this.dinosaursSize = 0;
        this.eggsSize = 0;
        this.dnsrTokenSize = 0;
        this.unit_test = false;
        this.promoCreatedCount = 0;
        this.gen0CreatedCount = 0;
        this.battleRankSize = 0;
        this.battleGroupMapSize = 0;
        this.battleGroupTotalSize = 0;
        ControlCenter.instance.initCLevelAddreses();
        if (this.lastTokenId == -1) {
            this._createEgg(0, 0, 0, 0, null, null, 0, address(0));
        }
        SaleDutchAuction.instance.gen0SaleCount = 0;
        SaleDutchAuction.instance.ownerCut = 200;
        SiringDutchAuction.instance.ownerCut = 200;
        this._seekingTax = 200;
    };
    Jurassic.prototype.getDNSRToken = function (_id) {
        return this._getDNSRTokenFromMap(_id);
    };
    Jurassic.prototype.getEgg = function (_id) {
        return this._getDinosaurEggFromMap(_id);
    };
    Jurassic.prototype.getDinosaur = function (_id) {
        return this._getDinosaurFromMap(_id);
    };
    Jurassic.prototype.getBattleGroupSize = function () {
        return this.battleGroupMapSize;
    };
    Jurassic.prototype.getPlayerHonor = function (owner) {
        return this.playerHonor.get(owner);
    };
    Jurassic.prototype.getPlayerUseHonorCt = function (owner) {
        return this.playerUseHonorCt.get(owner);
    };
    Jurassic.prototype.getBattleGroup = function (owner) {
        return this.battleGroupMap.get(owner) || "";
    };
    Jurassic.prototype.usePlayerHonor = function (owner, dnsrId, attrId) {
        AssertThrow(Blockchain.transaction.from == ControlCenter.instance.sysAddress);
        AssertThrow(this.ownerOf(dnsrId) == owner);
        AssertThrow(this._isDinosaurInFree(dnsrId));
        var dinosaur = this.dinosaurs.get(dnsrId);
        var egg = this.eggs.get(dnsrId);
        var attrValue = 0;
        var attrAddon = new NatureAddon({
            strength: dinosaur.strengthAddon,
            agile: dinosaur.agileAddon,
            lucky: dinosaur.luckyAddon,
            intelligence: dinosaur.intelligence
        });
        if (attrId == 1) {
            attrValue = GeneticAlgorithm.instance.getStrength(egg.natureF, egg.natureM, attrAddon);
        } else if (attrId == 2) {
            attrValue = GeneticAlgorithm.instance.getAgile(egg.natureF, egg.natureM, attrAddon);
        } else if (attrId == 3) {
            attrValue = GeneticAlgorithm.instance.getLucky(egg.natureF, egg.natureM, attrAddon);
        } else if (attrId == 4) {
            attrValue = GeneticAlgorithm.instance.getIntelligence(egg.natureF, egg.natureM, attrAddon);
        } else {
            return;
        }
        AssertThrow(attrValue < 1000);
        var needHonor = 0;
        var A = 0;
        if (attrValue < 100) {
            needHonor = 10;
        } else if (attrValue < 200) {
            needHonor = 15;
        } else if (attrValue < 300) {
            needHonor = 20;
        } else if (attrValue < 500) {
            A = 20;
        } else if (attrValue < 800) {
            A = 30;
        } else if (attrValue < 1000) {
            A = 60;
        } else {
            return;
        }
        var N = this.playerUseHonorCt.get(owner) + 1;
        if (A > 0) {
            if (N <= 30) {
                needHonor = Math.round(A * Math.pow(1.05, N - 1) + N - 1);
            } else if (N <= 40) {
                needHonor = Math.round(A * Math.pow(1.06, N - 1) + N - 1);
            } else if (N <= 50) {
                needHonor = Math.round(A * Math.pow(1.065, N - 1) + N - 1);
            } else {
                needHonor = Math.round(A * Math.pow(1.07, N - 1) + N - 1);
            }
        }
        console.log("NeedHonor : ", needHonor, N, A);
        var honor = this.playerHonor.get(owner);
        AssertThrow(honor >= needHonor);
        this.playerHonor.set(owner, honor - needHonor);
        this.playerUseHonorCt.set(owner, N);
        if (attrId == 1) {
            dinosaur.strengthAddon++;
        } else if (attrId == 2) {
            dinosaur.agileAddon++;
        } else if (attrId == 3) {
            dinosaur.luckyAddon++;
        } else if (attrId == 4) {
            dinosaur.intelligenceAddon++;
        } else {
            return;
        }
        this.dinosaurs.set(dnsrId.toString(), dinosaur);
        Event.Trigger(EventDef.UseHonor, {
            result: [honor - needHonor]
        });
    };
    Jurassic.prototype._cancleBattle = function (owner) {
        var bg = this.battleGroupMap.get(owner);
        AssertThrow(bg.owner == owner);
        this.battleGroupMap.del(owner);
        this.battleGroupArray.del(bg.pos.toString());
        var withdraw = new BigNumber(bg.dnsrCt * 10000000000000000);
        for (var i in bg.indexs) {
            var dinosaur = this._getDinosaurFromMap(bg.indexs[i]);
            dinosaur.isBattling = 0;
            this.dinosaurs.set(bg.indexs[i].toString(), dinosaur);
        }
        console.log("canclebattle ", bg, withdraw.toString());
        Blockchain.transfer(owner, withdraw.toString());
        this.battleGroupMapSize--;
    };
    Jurassic.prototype._getBattlePair = function () {
        console.log("_getBattlePair");
        var ret = [];
        for (var i = 1; i <= this.battleGroupTotalSize; i++) {
            var owner = this.battleGroupArray.get(i.toString());
            console.log(owner);
            if (this.battleGroupArray.get(i.toString()) && ret.length == 0) {
                ret.push(i);
                break;
            }
        }
        if (ret.length == 1) {
            var right = randBetween(1, this.battleGroupTotalSize + 1);
            while (true) {
                if (this.battleGroupArray.get(right.toString()) && right != ret[0]) {
                    ret.push(right);
                    break;
                } else {
                    right++;
                    if (right > this.battleGroupTotalSize) {
                        right = 1;
                    }
                }
            }
        }
        return ret;
    };
    Jurassic.prototype._fight = function (ownerBattleGroup, oppoBattleGroup) {
        var ownerDinosaurs = [];
        var oppoDinosaurs = [];
        var ownerAttrSum = 0;
        var oppoAttrSum = 0;
        for (var _i = 0, _a = ownerBattleGroup.indexs; _i < _a.length; _i++) {
            var i = _a[_i];
            var dinosaur = this._getDinosaurFromMap(i);
            if (dinosaur.birthTime != 0) {
                var egg = this._getDinosaurEggFromMap(i);
                var attrAddon = new NatureAddon({
                    strength: dinosaur.strengthAddon,
                    agile: dinosaur.agileAddon,
                    intelligence: dinosaur.intelligenceAddon,
                    lucky: dinosaur.luckyAddon
                });
                ownerAttrSum += GeneticAlgorithm.instance.getStrength(egg.natureF, egg.natureM, attrAddon);
                ownerAttrSum += GeneticAlgorithm.instance.getAgile(egg.natureF, egg.natureM, attrAddon);
                ownerAttrSum += GeneticAlgorithm.instance.getLucky(egg.natureF, egg.natureM, attrAddon);
                ownerAttrSum += GeneticAlgorithm.instance.getIntelligence(egg.natureF, egg.natureM, attrAddon);
                if (dinosaur.rankPos == 0) {
                    dinosaur.rankPos = ++this.battleRankSize;
                }
            }
            ownerDinosaurs.push(dinosaur);
        }
        for (var _b = 0, _c = oppoBattleGroup.indexs; _b < _c.length; _b++) {
            var i = _c[_b];
            var dinosaur = this._getDinosaurFromMap(i);
            if (dinosaur.birthTime != 0) {
                var egg = this._getDinosaurEggFromMap(i);
                var attrAddon = new NatureAddon({
                    strength: dinosaur.strengthAddon,
                    agile: dinosaur.agileAddon,
                    intelligence: dinosaur.intelligenceAddon,
                    lucky: dinosaur.luckyAddon
                });
                oppoAttrSum += GeneticAlgorithm.instance.getStrength(egg.natureF, egg.natureM, attrAddon);
                oppoAttrSum += GeneticAlgorithm.instance.getAgile(egg.natureF, egg.natureM, attrAddon);
                oppoAttrSum += GeneticAlgorithm.instance.getLucky(egg.natureF, egg.natureM, attrAddon);
                oppoAttrSum += GeneticAlgorithm.instance.getIntelligence(egg.natureF, egg.natureM, attrAddon);
                if (dinosaur.rankPos == 0) {
                    dinosaur.rankPos = ++this.battleRankSize;
                }
            }
            oppoDinosaurs.push(dinosaur);
        }
        console.log("attrs: ", ownerAttrSum, oppoAttrSum);
        var honor = 0;
        if (ownerAttrSum > oppoAttrSum) {
            honor = Math.floor(oppoAttrSum * 0.015);
            var playerHonor = this.playerHonor.get(ownerBattleGroup.owner);
            this.playerHonor.set(ownerBattleGroup.owner, playerHonor + honor);
            for (var _d = 0, ownerDinosaurs_1 = ownerDinosaurs; _d < ownerDinosaurs_1.length; _d++) {
                var dinosaur = ownerDinosaurs_1[_d];
                if (dinosaur.birthTime != 0) {
                    dinosaur.attributes -= 4;
                    dinosaur.winCt++;
                    dinosaur.battleCt++;
                }
            }
            for (var _e = 0, oppoDinosaurs_1 = oppoDinosaurs; _e < oppoDinosaurs_1.length; _e++) {
                var dinosaur = oppoDinosaurs_1[_e];
                if (dinosaur.birthTime != 0) {
                    dinosaur.attributes -= 6;
                    dinosaur.battleCt++;
                }
            }
        } else if (ownerAttrSum < oppoAttrSum) {
            honor = Math.floor(ownerAttrSum * 0.015);
            var playerHonor = this.playerHonor.get(oppoBattleGroup.owner);
            this.playerHonor.set(oppoBattleGroup.owner, playerHonor + honor);
            honor *= -1;
            for (var _f = 0, ownerDinosaurs_2 = ownerDinosaurs; _f < ownerDinosaurs_2.length; _f++) {
                var dinosaur = ownerDinosaurs_2[_f];
                if (dinosaur.birthTime != 0) {
                    dinosaur.attributes -= 6;
                    dinosaur.battleCt++;
                }
            }
            for (var _g = 0, oppoDinosaurs_2 = oppoDinosaurs; _g < oppoDinosaurs_2.length; _g++) {
                var dinosaur = oppoDinosaurs_2[_g];
                if (dinosaur.birthTime != 0) {
                    dinosaur.attributes -= 4;
                    dinosaur.winCt++;
                    dinosaur.battleCt++;
                }
            }
        }
        console.log("Reward honor : ", honor);
        for (var i in ownerBattleGroup.indexs) {
            var dinosaur = ownerDinosaurs[i];
            var dinosaurId = ownerBattleGroup.indexs[i];
            if (dinosaurId != 0) {
                console.log(dinosaurId);
                dinosaur.isBattling = 0;
                this.dinosaurs.set(dinosaurId.toString(), dinosaur);
                this.battleRankMap.set(dinosaur.rankPos.toString(), dinosaur);
            }
        }
        for (var i in oppoBattleGroup.indexs) {
            var dinosaur = oppoDinosaurs[i];
            var dinosaurId = oppoBattleGroup.indexs[i];
            if (dinosaurId != 0) {
                dinosaur.isBattling = 0;
                this.dinosaurs.set(dinosaurId.toString(), dinosaur);
                this.battleRankMap.set(dinosaur.rankPos.toString(), dinosaur);
            }
        }
        return honor;
    };
    Jurassic.prototype.getBattleRankMapSize = function () {
        return this.battleRankSize;
    };
    Jurassic.prototype.getBattleGroupArray = function (index) {
        return this.battleGroupArray.get(index.toString());
    };
    Jurassic.prototype.getBattleRankDinosarData = function (index) {
        return this.battleRankMap.get(index.toString());
    };
    Jurassic.prototype.canBreedWith = function (_motherId, _fatherId) {
        _motherId = parseInt(_motherId);
        _fatherId = parseInt(_fatherId);
        AssertThrow(_motherId > 0);
        AssertThrow(_fatherId > 0);
        return this._canBreedWith(_motherId, _fatherId);
    };
    Jurassic.prototype.isDinosaurReadyToHatched = function (_id) {
        if (this._getDinosaurPhase(_id) != this.EGG_PHASE) {
            return false;
        }
        var _egg = this._getDinosaurEggFromMap(_id);
        return (_egg.hatchEndTime <= nowInSeconds());
    };
    Jurassic.prototype.isEggReadyToLay = function (_id) {
        if (this._getDinosaurPhase(_id) != this.DINOSAUR_PHASE) {
            return false;
        }
        var _dinosaur = this._getDinosaurFromMap(_id);
        return (_dinosaur.breedingCDEndTime <= nowInSeconds());
    };
    Jurassic.prototype.isReadyForSeeking = function (_id) {
        AssertThrow(this._getDinosaurPhase(_id) == this.DINOSAUR_PHASE, "dinosaur phase", this._getDinosaurPhase(_id));
        AssertThrow(this._isDinosaurInFree(_id), "dinosaur not free");
        var _owner = this.seekingIndexToOwner.get(_id.toString());
        AssertThrow(_owner == null || _owner == address(0), "ownder", _owner);
        return true;
    };
    Jurassic.prototype.isReadyToBackHome = function (_id) {
        if (this._getDinosaurPhase(_id) != this.DINOSAUR_PHASE) {
            return false;
        }
        var _dinosaur = this._getDinosaurFromMap(_id);
        if (_dinosaur.seekingCDEndTime >= nowInSeconds()) {
            return false;
        }
        if (_dinosaur.seekingCDEndTime == 0) {
            return false;
        }
        var _owner = this.seekingIndexToOwner.get(_id.toString()) || address(0);
        if (_owner == address(0)) {
            return false;
        }
        return true;
    };
    Jurassic.prototype.getSeekingTax = function () {
        var avgPrice = SaleDutchAuction.instance.averageGen0SalePrice();
        if (avgPrice == 0) {
            avgPrice = 0.01;
        }
        console.log("\n>>get seeking tax", avgPrice, this._seekingTax);
        return avgPrice * this._seekingTax / 10000;
    };
    Jurassic.prototype.getSeekingOwner = function (tokenId) {
        return this.seekingIndexToOwner.get(tokenId.toString());
    };
    Jurassic.prototype.getNickname = function (tokenId) {
        return this.dinosuarNickname.get(tokenId.toString());
    };
    return Jurassic;
}());
module.exports = Jurassic;