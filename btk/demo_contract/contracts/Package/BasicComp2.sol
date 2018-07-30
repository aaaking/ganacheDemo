pragma solidity ^0.4.21;

import "./CompPackage.sol";
import "./ShuPackage.sol";

contract BasicComp2 is CompPackage, ShuPackage {
    uint32 public constant CARD_CATE = 64;     //合成卡的数量

    uint32[CARD_CATE] internal _cardCates = [50211, 50212, 50213, 50214, 50215, 50216, 50217, 50218, 60201, 60202, 60203, 60204, 60205, 60206, 60207, 60208, 60211, 60213, 60215, 60217, 70201, 70202, 70203, 70204, 70205, 70206, 70207, 70208, 70211, 70213, 70215, 70217, 80201, 80202, 80203, 80204, 80205, 80206, 80207, 80208, 80211, 80213, 80215, 80217, 90201, 90202, 90203, 90204, 90205, 90206, 90207, 90208, 90211, 90213, 90215, 90217, 100201, 100202, 100203, 100204, 100205, 100206, 100207, 100208];
    uint32[CARD_CATE] internal _cardsCnt = [62, 62, 62, 62, 62, 62, 62, 62, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    //包里每张卡已卖出的数量
    uint32[CARD_CATE] internal _cardsNum;

    mapping (uint32 => uint32) internal _cardCateToIndex;

    function BasicComp2 () public
    {
        
        for(uint32 i = 0; i < CARD_CATE; i++) {

            _cardCateToIndex[_cardCates[i]] = i;
        }
    }

    //抽卡
    function drawCardWithIndex(uint index) external onlyCtrl returns(uint32, uint32) {
        require(index < _cardsCnt.length);
        require(_cardsCnt[index] > 0);

        _drawCard(index);

        return (_cardCates[index], _cardsNum[index]);
    }

    function drawCardWithCate(uint32 cate) external onlyCtrl returns(uint32) {
        require(exists(cate));

        uint index = _cardCateToIndex[cate];

        require(_cardsCnt[index] > 0);
        _drawCard(index);

        return _cardsNum[index];
    } 

    //包里卡的种类数量
    function cardCateNum() external view returns(uint) {
        return CARD_CATE;
    }

    //包里第pos张卡的索引
    function indexAtPos(uint pos) external view returns(uint) {
        uint cnt = pos;
        for(uint i = 0; i < CARD_CATE; i++) {
            if(cnt < _cardsCnt[i]) {
                return i;
            } else {
                cnt -= _cardsCnt[i];
            }
        }

        return CARD_CATE;
    }

    //根据卡的id获取卡的索引
    function cardIndex(uint32 cate) public view returns(uint) {
        require(exists(cate));
        return _cardCateToIndex[cate];
    }

    //索引为index的卡的id
    function cardCate(uint index) public view returns(uint32) {
        require(index < _cardCates.length);
        return _cardCates[index];
    }

    //索引为i的卡剩余的数量
    function cardRemainNum(uint index) public view returns(uint) {
        require(index < _cardsCnt.length);
        return _cardsCnt[index];
    }

    //索引为i的卡已抽出来的数量
    function cardDrawedNum(uint index) public view returns(uint) {
        require(index < _cardsNum.length);
        return _cardsNum[index];
    }

    function _drawCard(uint index) internal {
        _cardsCnt[index]--;
        _cardsNum[index]++;
    }

    function exists(uint32 cate) public view returns(bool) {
        if (cate > 0) {
            uint index = _cardCateToIndex[cate];
            return _cardCates[index] == cate;
        } else {
            return false;
        }
    }
}