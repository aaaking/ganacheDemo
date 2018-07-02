pragma solidity ^0.4.21;

import "./Package.sol";

contract CompPackage is Package {

    uint internal _packageType = 2;

    function packageType() external view returns(uint) {
        return _packageType;
    }

}