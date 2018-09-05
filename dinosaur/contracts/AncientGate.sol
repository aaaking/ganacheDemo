pragma solidity ^0.4.18;

import "./ControlCenter.sol";
import "./Jurassic/Jurassic.sol";
import "./Auction/SaleDutchAuction.sol";
import "./Auction/SiringDutchAuction.sol";

// 远古之门维护了各个合约的地址，便于后的维护和更新
//
//      - AncientGate: 远古之门，固定地址的入口合约，管理其他合约的入口
//      - Jurassic: 侏罗纪，游戏主合约

contract AncientGate is ControlCenter {
    Jurassic public jurassic;
    SaleDutchAuction public saleDutchAuction;
    SiringDutchAuction public siringDutchAuction;

    function isCTO() public view returns(bool) {
        return msg.sender == ctoAddress;
    }

    function test(address p) public view onlyCTO returns(address) {
        return p;
    }

    // event AncientGateOpened();
    // event AncientGateClosed();

    // 设置游戏主合约的地址
    function setJurassicContract(address _address) public onlyCTO {
        Jurassic candidateContract = Jurassic(_address);

        // 确保设置了正确的合约地址
        require(candidateContract.IS_JURASSIC());
        jurassic = candidateContract;
    }

    // 设置恐龙蛋拍卖合约地址
    function setSaleAuctionContract(address _address) public onlyCTO {
        SaleDutchAuction candidateContract = SaleDutchAuction(_address);
        
        require(candidateContract.IS_SALEDUTCHAUCTION());
        saleDutchAuction = candidateContract;
    }

    // 设置生育权拍卖合约地址
    function setSiringAuctionContract(address _address) public onlyCTO {
        SiringDutchAuction candidateContract = SiringDutchAuction(_address);
        
        require(candidateContract.IS_SIRINGDUTCHAUCTION());
        siringDutchAuction = candidateContract;
    }

    // function () external {
    //     // DON'T receive balance
    // }

    // function openTheGate() public onlyCLevel {
    //     jurassic.unpause();
    //     saleDutchAuction.unpause();

    //     AncientGateOpened();
    // }

    // function closeTheGate() public onlyCLevel {
    //     jurassic.pause();
    //     saleDutchAuction.pause();

    //     AncientGateClosed();
    // }
}
