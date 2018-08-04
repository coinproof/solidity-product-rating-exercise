pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Rating is Ownable {
    constructor() public {
        owner = msg.sender;
    }    
}