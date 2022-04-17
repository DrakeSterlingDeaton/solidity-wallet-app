pragma solidity ^0.5.0;

import "./ItemManager.sol";

contract Item {
    uint public priceInWei; uint public paidWei; uint public index;
    ItemManager parentContract;
    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) public { priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }

    function() external payable {
        require(msg.value == priceInWei, "We don't support partial payments"); require(paidWei == 0, "Item is already paid!");
        paidWei += msg.value;
        (bool success, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index)); require(success, "Delivery did not work");
    }

}

//pragma solidity ^0.6.0;
//
//import "./ItemManager.sol";
//
//contract Item {
//
//    uint public priceInWei;                 // price of an item
//    uint public paidWei;                    // amount that's been paid for the item so far
//    uint public index;                      // uniquely identifying number for the item
//
//    ItemManager parentContract;             // instance of ItemManager to access its methods
//
//    // called once when the smart contract is first created on the blockchain
//    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) public { // calls all of the initialized variables above, and adds them to the item
//        priceInWei = _priceInWei;               // defines the item's price
//        index = _index;                         // defines the item's unique indentifier number
//        parentContract = _parentContract;       // defines the methods that can be used on the item
//    }
//
//receive() external payable {                                                        // fallback receive() function which can receive money
//require(msg.value == priceInWei, "We don't support partial payments");          // requires that the payment offered is the full amount
//require(paidWei == 0, "Item is already paid!");                                 // requires that the item hasn't already been paid for
//paidWei += msg.value;                                                           // adds the amount of money in the recieved to the amount that's been paid so far
//
//// call to
//(bool success, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index));    // returns true if the low-level transaction is successful
//require(success, "Delivery did not work");
//}
//
//fallback () external { }
//
//}