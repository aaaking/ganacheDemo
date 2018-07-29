pragma solidity ^0.4.21;

import "./SourcePackage.sol";
import "./ShuPackage.sol";

contract BasicSource2 is SourcePackage, ShuPackage {

    uint public constant CARD_CATE = 20;       //可抽卡的种类

    uint32[CARD_CATE] internal _cardCates = [30201, 30202, 30203, 30204, 40211, 40212, 40213, 40214, 40215, 40216, 40217, 40218, 50201, 50202, 50203, 50204, 50205, 50206, 50207, 50208];
    uint32[CARD_CATE] internal _cardsCnt = [2920, 2920, 2920, 2920, 500, 500, 500, 500, 500, 500, 500, 500, 40, 40, 40, 40, 40, 40, 40, 40];
    //包里每张卡已卖出的数量
    uint32[CARD_CATE] internal _cardsNum;

    mapping (uint32 => uint32) internal _cardCateToIndex;


    function BasicSource2 () public
    {
        
        for(uint32 i = 0; i < CARD_CATE; i++) {

            _cardCateToIndex[_cardCates[i]] = i;
        }
    }

    // function initCateIndex() external onlyCtrl {
    //     for(uint32 i = 0; i < CARD_CATE; i++) {

    //         _cardCateToIndex[_cardCates[i]] = i;
    //     }
    // }

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