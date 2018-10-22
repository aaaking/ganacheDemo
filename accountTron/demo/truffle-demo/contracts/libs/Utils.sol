pragma solidity ^0.4.23;

library Utils {
    function bytesToUint(bytes _data) internal pure returns (uint) {
        uint t = 0;
        uint d;
        for(uint i = 4; i < _data.length; i++) {
            d = uint(_data[i]);
            if((d >= 48) && (d < 58)) {
                t = (t << 4) + d - 48;
            } else if((d >= 97) && (d < 103)) {
                t = (t << 4) + d - 97 + 10;
            } else {
                revert("bytesToUint error");
            }
        }
        return t;
    }

    function bytesToString(bytes32 x) internal pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
}