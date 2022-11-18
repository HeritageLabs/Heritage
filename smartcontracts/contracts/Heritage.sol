// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./TransferHelper.sol";

interface IERC20 {
    function balanceOf(address owner) external returns(uint balance);
    function allowance(address owner, address spender) external returns(uint remaining);
}

contract Heritage is AutomationCompatibleInterface {
    HERITAGE[] private heritages;
    mapping(address => uint) private heritageId;

    struct HERITAGE {
        address owner;
        address heir;
        address[] tokens;
        uint lastSeen;
        uint checkInterval;
        bool fulfilled;
    }

    constructor() {
        create(address(0), 0);
    }

    modifier hasActiveHeritage(address _owner) {
        uint _index = heritageId[msg.sender];
        require(_index != 0, "You do not have an active heritage!");
        _;
    }

    function create(address _heir, uint _checkInterval) public {
        uint _index = heritages.length;
        // Revert if msg.sender already has an active legacy!
        require(heritageId[msg.sender] == 0, "Legacy exist!");
        heritages.push(HERITAGE(msg.sender, _heir, new address[](0), block.timestamp, _checkInterval, false));
        heritageId[msg.sender] = _index;
    }

    function cancel() public hasActiveHeritage(msg.sender) {
        delete heritages[heritageId[msg.sender]];
        heritageId[msg.sender] = 0;
    }

    function update(address _heir, uint _checkInterval) public hasActiveHeritage(msg.sender) {
        uint _index = heritageId[msg.sender];
        heritages[_index].checkInterval = _checkInterval;
        heritages[_index].heir = _heir;
    }
    function checkIn() public hasActiveHeritage(msg.sender) {
        uint _index = heritageId[msg.sender];
        heritages[_index].lastSeen = block.timestamp;
    }

    function addTokens(address[] memory _tokens) public {
	    uint _index = heritageId[msg.sender];
        for (uint i = 0; i < _tokens.length; i++) {
            IERC20 _token = IERC20(_tokens[i]);
            //Confirm token approval
            require(_token.allowance(msg.sender, address(this)) == type(uint).max, "token not approved!");
            heritages[_index].tokens.push(_tokens[i]);
        }
    }

    function updateCheckInterval(uint _checkInterval) public hasActiveHeritage(msg.sender) {
        uint _index = heritageId[msg.sender];
        heritages[_index].checkInterval = _checkInterval;
    }

    function updateHeir(address _heir) public hasActiveHeritage(msg.sender) {
        uint _index = heritageId[msg.sender];
        heritages[_index].heir = _heir;
    }




    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint _nextDueHeritage = _getNextDueHeritage();
        if (_nextDueHeritage == 0) {
            upkeepNeeded = false;
        } else {
            upkeepNeeded = true;
            performData = abi.encode(_nextDueHeritage);
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        //Decode perfromData
        uint256 _id = abi.decode(performData, (uint256));
        _fufillHeritage(_id);
    }

    // Getters

    function getHeritage(address _owner) public view returns(HERITAGE memory){
        return heritages[heritageId[_owner]];
    }

    function getHeritageTokens(address _owner) public view returns(address[] memory) {
        return heritages[heritageId[_owner]].tokens;
    }

    function hasHeritage(address _owner) public view returns(bool) {
        if (heritageId[_owner] == 0) {
            return false;
        } else {
            return true;
        }
    }

    // Internal functions
    function _getNextDueHeritage() internal view returns(uint) {
        for (uint i = 1; i < heritages.length; i++) {
            HERITAGE memory _heritage = heritages[i];
            if (!_heritage.fulfilled && block.timestamp - _heritage.lastSeen > _heritage.checkInterval) {
                return i;
            }
        }
        return 0;
    }

    function _fufillHeritage(uint _id) internal {
        HERITAGE memory _heritage = heritages[_id];    
        //Confirm heritage is due
        require(block.timestamp - _heritage.lastSeen > _heritage.checkInterval, "not due!" );
        heritages[_id].fulfilled = true;

        //Transfer tokens to heir
        for (uint256 i = 0; i < _heritage.tokens.length; i++) {
  		    address _token = _heritage.tokens[i];
            uint256 _allowed = IERC20(_token).allowance(_heritage.owner, address(this));
            uint256 _balance = IERC20(_token).balanceOf(_heritage.owner);
            // Skip tokens not approved 
            if (_allowed < _balance) {
                continue;
            }
            TransferHelper.safeTransferFrom(
                _token,
                _heritage.owner,
                _heritage.heir,
                _balance
            );
        }
    }


}
