pragma solidity ^0.4.21;

import './Package.sol';

contract WeiPackage is Package {
    uint internal _camp = 1;

    function packageCamp() external view returns(uint) {
        return _camp;
    }
}