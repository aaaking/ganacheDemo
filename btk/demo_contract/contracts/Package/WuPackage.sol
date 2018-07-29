pragma solidity ^0.4.21;

import './Package.sol';

contract WuPackage is Package {
    uint internal _camp = 3;

    function packageCamp() external view returns(uint) {
        return _camp;
    }
}