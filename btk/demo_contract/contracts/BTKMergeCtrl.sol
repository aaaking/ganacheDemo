pragma solidity ^0.4.0;

import "./Package/Package.sol";
import "./Ctrlship/Pausable.sol";
import "./BTKMediator.sol";
import "./CardChecker.sol";
import "./libs/CardUtils.sol";

contract BTKMergeCtrl is Pausable, CardChecker {
    event MergeCard(address indexed from, uint64 indexed merged, uint64[] cards);
    event AddPackage(address package, uint packageType);

    uint32 constant CAMP_CNT = 4;
    uint32 constant COMP_PACKAGE = 2;
    
    Package[CAMP_CNT][] public compPackages;

    BTKMediator public mediator;

    function existsOfCardCate(uint32 cate) public view returns (bool) {
        uint pi = CardUtils.packageNum(cate);           //包的序号
        uint ci = CardUtils.camp(cate) - 1;   //阵营
        
        if(ci >= CAMP_CNT) {
            return false;
        }

        if(pi < compPackages.length &&
            (address(compPackages[pi][ci]) != 0) && 
            compPackages[pi][ci].exists(cate)) {
                return true;
        }

        return false;
    }

    function addPackage(Package package, uint n) external onlyOwner {
        uint pType = package.packageType();
        require(pType == COMP_PACKAGE);

        if(compPackages.length == n) {
            compPackages.length++;
        } else if(compPackages.length < n) {
            revert();
        }

        uint camp = package.packageCamp() - 1;
        require(address(compPackages[n][camp]) == 0);

        compPackages[n][camp] = package;

        emit AddPackage(package, pType);
    }

    function setMediator(BTKMediator cont) external onlyOwner {
        mediator = cont;
    }

    function mergeCard(uint32 toCate, uint64[] cards) external whenNotPaused {
        uint star = CardUtils.star(toCate);
        require(star > 4);
        uint32 cate;
        if (star == 5) {
            cate = _mergeCard5(cards);
        } else if(star == 6) {
            cate = _mergeCard6(cards);
        } else if (star == 7) {
            cate = _mergeCard7(cards);
        } else if (star == 8) {
            cate = _mergeCard8(cards);
        } else if (star == 9) {
            cate = _mergeCard9(cards);
        } else if (star == 10) {
            cate = _mergeCard10(cards);
        } else {
            revert();
        }

        require(toCate == cate);

        uint32 num = _drawCard(cate);

        for(uint i = 0; i < cards.length; i++) {
            mediator.burn(msg.sender, cards[i]);
        }

        uint64 token = CardUtils.toToken(cate, num);
        mediator.mint(msg.sender, token);

        emit MergeCard(msg.sender, token, cards);
    }

    function _mergeCard5(uint64[] _cards) internal pure returns(uint32) {
        require(_cards.length == 12);        
        uint32[] memory cates = new uint32[](12);

        uint32 cate;
        uint j;
        for(uint i = 0; i < 12; i++) {
            cates[i] = CardUtils.toCate(_cards[i]);
        }

        for(i = 0; i < 2; i++) {
            cate = cates[i*4];
            for(j = 1; j < 4; j++) {
                require(CardUtils.star(cates[i*4+j]) == 4-i);       //前四张是四星 中间四张是三星
                cates[i*4+j] == cate;                               //前四张相同 中间四张相同
            }
        }

        require(cates[4] == _specialCate5(cates[0]));     //中间四张卡要是第一张卡的指定卡
        for(i = 8; i < 12; i++) {
            require(CardUtils.star(cates[i]) == 4);             //后四张是四星
            require(CardUtils.camp(cates[0]) == CardUtils.camp(cates[i]));  //第一张卡和后四张张卡阵营相同
        }

        return _increaseStar(cates[0]);
    }

    function _mergeCard6(uint64[] _cards) internal pure returns(uint32) {
        require(_cards.length == 6);        

        uint32 cate;
        uint32[] memory cates = new uint32[](6);
        for(uint i = 0; i < 6; i++) {
            cate = CardUtils.toCate(_cards[i]);
            cates[i] = cate;
            require(CardUtils.star(cate) == 5);     //必须都是5星卡
        }

        cate = cates[0];
        require(cates[1] == cate);       //前两张相同

        require(cates[2] == _specialCate6(cates[0]));     //第三张卡要是第一张卡的指定卡

        require(CardUtils.camp(cate) == CardUtils.camp(cates[3]));  //第一张卡和后三张卡阵营相同

        return _increaseStar(cate);
    }

    function _mergeCard7(uint64[] cards) internal pure returns(uint32) {
        require(cards.length == 5);

        uint32 cate = CardUtils.toCate(cards[0]);
        require(CardUtils.star(cate) == 6);         //第一张卡是六星

        uint32 cate1;
        for(uint i = 1; i < 5; i++) {
            cate1 = CardUtils.toCate(cards[i]);
            require(CardUtils.star(cate1) == 5);            //后四张都是五星

            require(CardUtils.camp(cate) == CardUtils.camp(cate1));     //后四张的阵营与第一张相同
        }


        return _increaseStar(cate);
    }

    function _mergeCard8(uint64[] cards) internal pure returns(uint32) {
        require(cards.length == 5);

        uint32 cate = CardUtils.toCate(cards[0]);
        require(CardUtils.star(cate) == 7);             //第一张是七星

        uint32 cate1 = CardUtils.toCate(cards[1]);
        require(CardUtils.star(cate1) == 6);            //第二张是六星
        require(CardUtils.camp(cate) == CardUtils.camp(cate1));     //第二张与第一张阵营相同

        uint32 cate2;
        for(uint i = 2; i < 5; i++) {
            cate2 = CardUtils.toCate(cards[i]);
            require(CardUtils.star(cate2) == 5);            //后三张都是五星
            require(CardUtils.camp(cate) == CardUtils.camp(cate2));     //后三张与第一张阵营相同
        }

        return _increaseStar(cate);
    }

    function _mergeCard9(uint64[] cards) internal pure returns(uint32) {
        require(cards.length == 5);

        uint32[] memory cates = new uint32[](5);
        for(uint i = 0; i < 5; i++) {
            cates[i] = CardUtils.toCate(cards[i]);
        }

        require(CardUtils.star(cates[0]) == 8);         //第一张是八星

        require(CardUtils.star(cates[1]) == 5);         //第二张是五星
        require((cates[0] - 80000) == (cates[1] - 50000));      //第一张和第二张是同类型

        require(CardUtils.star(cates[2]) == 6);         //第三张是六星
        require(CardUtils.camp(cates[0]) == CardUtils.camp(cates[2]));  //第三张和第一张的阵营相同

        require(CardUtils.star(cates[3]) == 5);         
        require(CardUtils.star(cates[4]) == 5);
        require(CardUtils.camp(cates[0]) == CardUtils.camp(cates[3]));
        require(CardUtils.camp(cates[0]) == CardUtils.camp(cates[4]));

        return _increaseStar(cates[0]);
    }

    function _mergeCard10(uint64[] cards) internal pure returns(uint32) {
        require(cards.length == 5);
        
        uint32[] memory cates = new uint32[](5);
        for(uint i = 0; i < 5; i++) {
            cates[i] = CardUtils.toCate(cards[i]);
        }

        require(CardUtils.star(cates[0]) == 9);
        require(CardUtils.star(cates[1]) == 9);

        require(cates[2] == cates[3]);
        require(CardUtils.star(cates[2]) == 5);
        require((cates[0] - 90000) == (cates[2] - 50000));

        require(CardUtils.star(cates[4]) == 6);        
        require(CardUtils.camp(cates[0]) == CardUtils.camp(cates[4]));

        return _increaseStar(cates[0]);
    }

    function _drawCard(uint32 card) internal returns(uint32) {
        Package p = compPackages[CardUtils.packageNum(card)][CardUtils.camp(card) - 1];
        require(address(p) != 0);

        return p.drawCardWithCate(card);
    }

    function _increaseStar(uint32 card) internal pure returns(uint32) {
        return card + 10000;
    }

    function _specialCate5(uint32 cate) internal pure returns(uint32) {
        uint32 cate1 = (cate - 10010) / 10 * 10;
        uint32 cate2 = (cate % 10 + 1) >> 1;

        return cate1 + cate2;
    }

    function _specialCate6(uint32 cate) internal pure returns(uint32) {
        uint32 cate1 = cate % 100;
        if(cate1 < 10) {
            return cate + 10;
        } else if(cate1 == 11) {
            return cate + 2;
        } else if(cate1 == 13) {
            return cate - 2;
        } else if(cate1 == 15) {
            return cate + 2;
        } else if(cate1 == 17) {
            return cate - 2;
        } else {
            revert();
        }
    }
}
