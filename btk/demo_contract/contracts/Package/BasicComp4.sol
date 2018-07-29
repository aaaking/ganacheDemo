pragma solidity ^0.4.21;

import "./CompPackage.sol";
import "./QunPackage.sol";

contract BasicComp4 is CompPackage, QunPackage {
    uint32 public constant CARD_CATE = 64;     //合成卡的数量

    uint32[CARD_CATE] internal _cardCates = [50411, 50412, 50413, 50414, 50415, 50416, 50417, 50418, 60401, 60402, 60403, 60404, 60405, 60406, 60407, 60408, 60411, 60413, 60415, 60417, 70401, 70402, 70403, 70404, 70405, 70406, 70407, 70408, 70411, 70413, 70415, 70417, 80401, 80402, 80403, 80404, 80405, 80406, 80407, 80408, 80411, 80413, 80415, 80417, 90401, 90402, 90403, 90404, 90405, 90406, 90407, 90408, 90411, 90413, 90415, 90417, 100401, 100402, 100403, 100404, 100405, 100406, 100407, 100408];
    uint32[CARD_CATE] internal _cardsCnt = [62, 62, 62, 62, 62, 62, 62, 62, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    //包里每张卡已卖出的数量
    uint32[CARD_CATE] internal _cardsNum;

    mapping (uint32 => uint32) internal _cardCateToIndex;

    function BasicComp4 () public
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