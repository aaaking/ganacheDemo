pragma solidity ^0.4.17;

contract HelloWorld {
    function say() public pure returns (string) {
        return "Hellow World function";
    }

    //
    function print(string name) public pure returns (string) {
        return name;
    }

    function getBalance() returns (uint){
        return this.balance;
    }
}