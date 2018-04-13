pragma solidity ^0.4.0;
contract SanGuoSha {
    event BuyPackage(address indexed from, uint value, uint card, uint randnum);
    event SaleCard(address indexed from, uint indexed card, uint indexed price, uint id);
    event BuyCard(address indexed from, uint indexed card, uint indexed price, uint id);
    event CancelSale(address indexed from, uint id);
    
    struct SalingCard {
        uint32 id;
        uint32 card;
        uint32 price;
        address saler;
    }
    
    uint32 constant PackagePrice = 0x20;
    
    // uint blockNum;
    // uint public randSeed = 234;
    
    uint32 PackageCate = 0;
    uint32 constant CardCateNum = 25;
    uint[CardCateNum] cardStorage = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1000, 1100, 1200, 1300, 1400, 1000];
    uint public cardsCnt;
    
    SalingCard[] inSaledCards;

    mapping (address => uint[CardCateNum]) playerCards;
    
    function SanGuoSha() {
        for (uint i = 0; i < cardStorage.length; i++) {
            cardsCnt += cardStorage[i];
        }
    }
    
    function getCardStorage() public view returns (string) {
        return arrayToString(cardStorage);
    }
    
    function getPlayerStorage() public view returns (string) {
        return arrayToString(playerCards[msg.sender]);
    }
    
    function saleCard(uint32 card, uint32 price) public {
        uint cnt = playerCards[msg.sender][card];
        require(cnt > 0);
        
        playerCards[msg.sender][card] = cnt - 1;
        
        uint32 len = uint32(inSaledCards.length);
        inSaledCards.push(SalingCard(len, card, price, msg.sender));
        
        emit SaleCard(msg.sender, card, price, len);
    }
    
    function getInSaledCards() public view returns (string) {
        uint[] memory valueLength = new uint[](inSaledCards.length * 4);
        
        uint totalLength = 0;
        uint idLen; 
        uint cardLen;
        uint priceLen;
        uint ownerLen = 1;
        for (uint i = 0; i < inSaledCards.length; i++) {
            idLen = calcUintLen(inSaledCards[i].id);
            valueLength[i*4] = idLen;
            
            cardLen = calcUintLen(inSaledCards[i].card);
            valueLength[i*4+1] = cardLen;
            
            priceLen = calcUintLen(inSaledCards[i].price);
            valueLength[i*4+2] = priceLen;
            
            valueLength[i*4+3] = ownerLen;
            
            totalLength = totalLength + idLen + cardLen + priceLen + ownerLen + 4;
        }
        
        bytes memory result = new bytes(totalLength);
        uint start = 0;
        uint vLen;
        for (i = 0; i < inSaledCards.length; i++) {
            vLen = valueLength[i*4];
            uintToBytes(result, start, vLen, inSaledCards[i].id);
            start += vLen;
            
            result[start] = ',';
            start++;
            
            vLen = valueLength[i*4+1];
            uintToBytes(result, start, vLen, inSaledCards[i].card);
            start += vLen;
            
            result[start] = ',';
            start++;
            
            vLen = valueLength[i*4+2];
            uintToBytes(result, start, vLen, inSaledCards[i].price);
            start += vLen;
            
            result[start] = ',';
            start++;
            
            vLen = valueLength[i*4+3];
            if (inSaledCards[i].saler == msg.sender) {
                uintToBytes(result, start, vLen, 1);
            } else {
                uintToBytes(result, start, vLen, 0);
            }
            start += vLen;
            
            result[start] = ';';
            start++;
        }
        
        return string(result);
    }
    
    function buyCard(uint id) public payable {
        require(id < inSaledCards.length);
        
        SalingCard storage card = inSaledCards[id];
        // require(card != null);
        require(msg.value >= card.price);
        // require(msg.sender != card.saler);
        playerCards[msg.sender][card.card]++;
        
        require(card.saler.send(card.price));         
        delete inSaledCards[id];
    }
    
    function cancelSale(uint id) public {
        require(id < inSaledCards.length);
        
        SalingCard storage card = inSaledCards[id];
        // require(card != null);
        require(msg.sender == card.saler);
        playerCards[card.saler][card.card]++;
        delete inSaledCards[id];
    }
    
    function buyPackage() public payable {
        require(cardsCnt > 0);
        require(msg.value >= PackagePrice);
        uint randnum = rand();
        uint card = getCardAtPos(randnum);
        require(card < CardCateNum);
        
        uint cnt = cardStorage[card];
        require(cnt > 0);
        
        playerCards[msg.sender][card]++;
        cardStorage[card]--;
        cardsCnt--;
        
        emit BuyPackage(msg.sender, msg.value, card, randnum);
    }
    
    function getCardAtPos(uint pos) internal view returns (uint) {
        uint cnt = 0;
        for (uint i = 0; i < CardCateNum; i++) {
            cnt += cardStorage[i];
            if ( pos < cnt ) {
                return i;
            }
        }
        
        return CardCateNum;
    }
    
    function rand() internal view returns (uint) {
        // if ( blockNum != block.number ) {
        //     blockNum = block.number;
        //     randSeed = uint64(block.blockhash(blockNum - 1));
        // }
        
        // uint a = 13;
        // uint b = 31;
        
        // randSeed = (a * randSeed + b) % cardsCnt;
        // return randSeed;
        uint64 _seed = uint64(keccak256(keccak256(block.blockhash(block.number - 1), _seed), now));
        return _seed % cardsCnt;
    }
    
    function arrayToString(uint[CardCateNum] a) internal pure returns (string) {
        uint len = a.length;
        uint[] memory keyLength = new uint[](len);
        uint[] memory valueLength = new uint[](len);
        uint totalLength = 0;
        for(uint i = 0; i < len; i++) {
            uint kLen = calcUintLen(i);
            uint vLen = calcUintLen(a[i]);
            
            keyLength[i] = kLen;
            valueLength[i] = vLen;
            totalLength = totalLength + kLen + vLen + 2;
        }
        
        bytes memory result = new bytes(totalLength);
        // bytes memory result;
        
        uint start = 0;
        for(i = 0; i < len; i++) {
            kLen = keyLength[i];
            vLen = valueLength[i];
            
            uintToBytes(result, start, kLen, i);
            start += kLen;
            
            result[start] = ':';
            start++;
            uintToBytes(result, start, vLen, a[i]);
            start += vLen;
            
            result[start] = ',';
            start++;
        }
        
        return string(result);
    }
    
    function uintToBytes(bytes r, uint s, uint len, uint n) internal pure {
        uint y = n;
        for(uint j = len; j > 0; j--) {
            r[s + j - 1] = byte(y % 10 + 48);
            y = y / 10;
        }
    }
    
    function calcUintLen(uint n) internal pure returns(uint){
        uint y = n;
        uint i = 0;
        if(y == 0) {
            i = 1;
        } else {
            do {
                i++;
                y = y / 10;
            } while(y > 0);
        }
        
        return i;
    }
}
