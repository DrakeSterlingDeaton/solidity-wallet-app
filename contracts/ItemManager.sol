pragma solidity ^0.5.0;

import "./Item.sol";
import "./Ownable.sol";

contract ItemManager is Ownable {

    // Enums restrict a variable to have one of only a few predefined values. The values in this enumerated list (which starts of 0, then 1, then 2...) are called enums.
    enum SupplyChainSteps{Created, Paid, Delivered}    // The three supply chain steps any create item will have

    // Structs are used to represent a record.
    struct S_Item {                 // this struct will be created for each Supply_Item
        ItemManager.SupplyChainSteps _step;     // defines the current step in the supply chain that the item is at
        string _identifier;     // used to uniquely identify each supply item
        Item _item;             // defines the item object from the "Item" import
    }

    mapping(uint => S_Item) public items;       // dictionary of supply items
    uint index;     // uniquely identifying index given to each supply item

    event SupplyChainStep(uint _itemIndex, uint _step, address _address);     // event to send to listeners when emitted (see below)

    function createItem(string memory _identifier, uint _priceInWei) public onlyOwner {       // creates a new supply item
        Item item = new Item(this, _priceInWei, index);             // creates new instance of item
        items[index]._item = item;                                  // assigns
        items[index]._step = SupplyChainSteps.Created;              // assigns the new supply item it's first step in the supply chain
        items[index]._identifier = _identifier;                     // assign the new supply item a unique identifier
        emit SupplyChainStep(index, uint(items[index]._step), address(item)); // emit allows anyone "listening" to this smart contract to be notified.
        // Here, they'll be notified that a new supply item (index) is at the first supply chain step, "created"
        index++;                                                    // increments the unique identifer
    }

    function triggerPayment(uint _index) public payable {                   // recieves payment
        Item item = items[_index]._item;    // retrieves object for specific item from the dictionary of items
        require(address(item) == msg.sender, "Only items are allowed to update themselves");        // checks that its the item itself that trying to trigger the payment.
        require(items[index]._step == SupplyChainSteps.Created, "Item is further in the supply chain");     // triggers cancellation is the
        items[_index]._step = SupplyChainSteps.Paid;                                                        // increments items location in the supply chain from "created" to "paid"
        emit SupplyChainStep(_index, uint(items[_index]._step), address(item));                             // Listeners will be notified that the supply item (index) is now at the second supply chain step, "paid"
    }



    function triggerDelivery(uint _index) public onlyOwner {
        require(items[_index]._step == SupplyChainSteps.Paid, "Item is further in the supply chain");       // trigger cancellation if the supply chain step associated with this item IS NOT "paid"
        items[_index]._step = SupplyChainSteps.Delivered;                                                   // updates the supply chain step to "delivered"
        emit SupplyChainStep(_index, uint(items[_index]._step), address(items[_index]._item));                                            // Listeners will be notified that the supply item (index) is now at the final supply chain step, "delivered"
    }

}

