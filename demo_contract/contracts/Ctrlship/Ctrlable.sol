pragma solidity ^0.4.21;

import './Pausable.sol';

contract Ctrlable is Pausable {
    event CtrlshipTransferred(address indexed previousCtrl, address indexed newCtrl);

    address public _ctrl;

    function Ctrlable() public {
        _ctrl = msg.sender;
    }

    modifier onlyCtrl() {
        require(_ctrl == msg.sender);
        _;
    }

    function transferCtrlShip(address newCtrl) public onlyOwner {
        require(newCtrl != address(0));
        emit CtrlshipTransferred(_ctrl, newCtrl);
        _ctrl = newCtrl;
    }
}