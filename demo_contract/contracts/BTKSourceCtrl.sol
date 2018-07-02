pragma solidity ^0.4.0;

import "./Package/Package.sol";
import "./Ctrlship/Pausable.sol";
import "./BTKMediator.sol";
import "./CardChecker.sol";
import "./libs/CardUtils.sol";
import "./Random.sol";

contract BTKSourceCtrl is Pausable, CardChecker {
    event BuyPackage(address indexed from, uint cate, uint num, uint64 card, uint randnum);
    event AddPackage(address package, uint packageType);

    uint32 constant CAMP_CNT = 4;
    uint32 constant SOURCE_PACKAGE = 1;
    uint public price = 10 wei;       //包的价格
    
    Package[CAMP_CNT][] public sourcePackages;

    BTKMediator public mediator;
    Random random;

    uint public totalCardsCnt;               //可抽卡的当前总量
    uint[] public cardsCnt;
    uint[CAMP_CNT][] public campCardsCnt;

    function existsOfCardCate(uint32 cate) public view returns (bool) {
        uint pi = CardUtils.packageNum(cate);           //包的序号
        uint ci = CardUtils.camp(cate) - 1;   //阵营
        
        if(ci >= CAMP_CNT) {
            return false;
        }

        if(pi < sourcePackages.length &&
            (address(sourcePackages[pi][ci]) != 0) && 
            sourcePackages[pi][ci].exists(cate)) {
                return true;
        }

        return false;
    }

    function addPackage(Package package, uint n) external onlyOwner {
        uint pType = package.packageType();
        require(pType == SOURCE_PACKAGE);

        Package[CAMP_CNT][] storage packages = sourcePackages;

        if(packages.length == n) {
            packages.length++;
            campCardsCnt.length++;
            cardsCnt.length++;
        } else if(packages.length < n) {
            revert();
        }

        uint camp = package.packageCamp() - 1;
        require(address(packages[n][camp]) == 0);

        packages[n][camp] = package;

        uint cnt = 0;
        uint cardCate = package.cardCateNum();
        for(uint i = 0; i < cardCate; i++ ) {
            cnt += package.cardRemainNum(i);
        }

        campCardsCnt[n][camp] = cnt;
        totalCardsCnt += cnt;
        cardsCnt[n] += cnt;

        emit AddPackage(package, pType);
    }

    function setMediator(BTKMediator cont) external onlyOwner {
        mediator = cont;
    }

    function setRandomAddress(Random _rand) external onlyOwner {
        random = _rand;
    }

    function changePackagePrice(uint _price) external onlyOwner {
        price = _price;
    }
    
    function buyPackage() external payable whenNotPaused {
        require(totalCardsCnt > 0);
        require(msg.value >= price);
        uint randnum = _rand();
        uint i;
        Package p;
        uint pi;
        uint32 camp;
        (p, i, pi, camp) = _getCardAtPos(randnum);

        require(address(p) != 0);
        require(i < p.cardCateNum());

        uint32 cate;
        uint32 num;
        (cate, num) = p.drawCardWithIndex(i);

        uint64 token = CardUtils.toToken(cate, num);

        mediator.mint(msg.sender, token);

        totalCardsCnt--;
        cardsCnt[pi]--;
        campCardsCnt[pi][camp]--;
        
        emit BuyPackage(msg.sender, cate, num, token, randnum);
    }
    
    function _getCardAtPos(uint pos) internal view returns (Package, uint, uint, uint32) {
        require(pos < totalCardsCnt);

        uint cnt = pos;
        uint packageCnt; 
        uint campPackageCnt;
        for (uint i = 0; i < sourcePackages.length; i++) {
            packageCnt = cardsCnt[i];
            if(cnt < packageCnt) {
                for(uint32 j = 0; j < CAMP_CNT; j++) {
                    campPackageCnt = campCardsCnt[i][j];
                    if(cnt < campPackageCnt) {
                        Package p = sourcePackages[i][j];
                        return (p, p.indexAtPos(cnt), i, j);
                    } else {
                        cnt -= campPackageCnt;
                    }
                }
            } else {
                cnt -= packageCnt;
            }
        }
    }
    
    function _rand() internal returns (uint) {
        // uint64 _seed = uint64(keccak256(keccak256(block.blockhash(block.number - 1), _seed), now));
        uint _seed = random.next();
        return _seed % totalCardsCnt;
    }

}
