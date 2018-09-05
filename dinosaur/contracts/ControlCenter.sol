pragma solidity ^0.4.18;

import "./Debug.sol";
import "./Utils.sol";

// 控制中心定义角色的权限以及管理合约的执行
contract ControlCenter is Debug, Utils {
    /*
     * CEO: 可以指派其他角色，并拥有超级权限
     * CTO: 可以处理技术相关的操作
     * CFO: 可以处理资金相关的操作
     * COO: 可以处理运营相关的操作
     * SYS: 系统调用
     */

    address public ceoAddress;
    address public ctoAddress;
    address public cfoAddress;
    address public cooAddress;
    address public sysAddress;

    // 控制合约是否暂停
    bool public paused = false;

    constructor() internal {
        paused = true;

        ceoAddress = msg.sender;
        ctoAddress = msg.sender;
        cfoAddress = msg.sender;
        cooAddress = msg.sender;
        sysAddress = msg.sender;
    }

    /*** MODIFIER ***/

    modifier onlyCEO() {
        require(msg.sender == ceoAddress);
        _;
    }

    modifier onlyCTO() {
        require(msg.sender == ctoAddress || msg.sender == ceoAddress);
        _;
    }

    modifier onlyCFO() {
        require(msg.sender == cfoAddress || msg.sender == ceoAddress);
        _;
    }

    modifier onlyCOO() {
        require(msg.sender == cooAddress || msg.sender == ceoAddress);
        _;
    }

    modifier onlySYS() {
        require(msg.sender == sysAddress || msg.sender == ceoAddress);
        _;
    }

    modifier onlyCLevel() {
        require(
            msg.sender == ceoAddress ||
            msg.sender == ctoAddress ||
            msg.sender == cfoAddress ||
            msg.sender == cooAddress
        );
        _;
    }

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    /*** FUNCTION ***/

    // 设置各种权限角色
    function setCEO(address _newCEO) public onlyCEO {
        require(_newCEO != address(0));

        ceoAddress = _newCEO;
    }

    function setCTO(address _newCTO) public onlyCEO {
        require(_newCTO != address(0));

        ctoAddress = _newCTO;
    }

    function setCFO(address _newCFO) public onlyCEO {
        require(_newCFO != address(0));

        cfoAddress = _newCFO;
    }

    function setCOO(address _newCOO) public onlyCEO {
        require(_newCOO != address(0));

        cooAddress = _newCOO;
    }

    function setSYS(address _newSYS) public onlyCEO {
        require(_newSYS != address(0));

        sysAddress = _newSYS;
    }

    // CTO 权限
    // 一般情况下只有 CTO 可以暂停合约，但是紧急情况下 C level 权限的角色都可以暂停合约的运行
    // 但是只有 CTO 才可以重新开启合约的运行
    function pause() public onlyCLevel whenNotPaused {
        paused = true;
    }

    function unpause() public onlyCTO whenPaused {
        paused = false;
    }
}
