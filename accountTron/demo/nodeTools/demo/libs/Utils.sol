pragma solidity ^0.4.20;

library Utils {
    function bytesToUint(bytes _data) internal pure returns (uint) {
        uint t = 0;
        uint d;
        for(uint i = 4; i < _data.length; i++) {
            d = uint(_data[i]);
            if((d >= 48) && (d < 58)) {
                t = (t << 4) + d - 48;
            } else if((d >=97) && (d < 103)) {
                t = (t << 4) +  d - 97 + 10;
            } else {
                revert();
            }
        }

        return t;
    }
}