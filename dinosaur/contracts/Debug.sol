pragma solidity ^0.4.18;

contract Debug {
    event LogUint(string label, uint256 value);
    event LogInt(string label, int256 value);

    bool public unit_test = false;

    function logstring(string s) internal {
        LogUint(s, 0);
    }

    function loguint(string s, uint256 v) internal {
        LogUint(s, v);
    }

    function logbool(string s, bool b) internal {
        if (b) {
            LogUint(s, 1);
        } else {
            LogUint(s, 0);
        }
    }

    function nowtime () public view returns (uint256) {
        return now;
    }
    
    function enableUnitTest(bool flag) internal {
        unit_test = flag;
    }    
}
