import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, cost: 0, itemName: "Example_1" };

    listenToPaymentEvent = () => {
        this.itemManager.events.SupplyChainStep().on("data", async (evt) => {
            if(evt.returnValues._step === 1) {
                let item = await this.itemManager.methods.items(evt.returnValues._itemIndex).call();
                console.log(item);
                alert("Item " + item._identifier + " was paid, deliver it now!");
            }
            console.log(evt);
        });
    }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
        this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
        this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
        this.networkId = await this.web3.eth.net.getId();       // Gets the current network address

        this.deployedNetwork4IM = ItemManagerContract.networks[this.networkId]; // Selects from a list of networks where this contract has been deployed to (using the "networks" JSON attribute within the react project's "contract/{SmartContract}.json" file
                                                                            // With your current network address

        this.itemManager = new this.web3.eth.Contract(                            // Creates a new instance of the web3.js Contract class.
            ItemManagerContract.abi,                                       // Uses the ABI file (stored as an attribute within "contract/{SmartContract}.json" file) to access the methods of the Smart Contract
            this.deployedNetwork4IM && this.deployedNetwork4IM.address,                      // Adding the address of the contract that is to be called
        );

        console.log(ItemManagerContract);

        this.deployedNetwork4I = ItemContract.networks[this.networkId];

        this.item = new this.web3.eth.Contract(
            ItemContract.abi,
            this.deployedNetwork4I && this.deployedNetwork4I.address,
        );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToPaymentEvent();
      this.setState({ loaded: true });   // adding the users wallet accounts & the specified smart contract to the state. Then, calling a callback function
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      })
  };

  handleSubmit = async() => {
      const { cost, itemName } = this.state;
      console.log(itemName, cost, this.itemManager);
      console.log(this.accounts);
      let result = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] });
      console.log(result);
      alert("Send "+cost+" Wei to " + result.events.SupplyChainStep.returnValues._address);
  };

  render() {
    if (!this.state.loaded) {
      return (
          <div>Loading Web3, accounts, and contract...</div>
        )
    }
    return (
        <div className="App">
            <h1>Simply Payment/Supply Chain Example!</h1>
            <h2>Items</h2>

            <h2>Add Element</h2>

            Cost: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange}/>

            Item Name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange}/>

            <button type="button" onClick={this.handleSubmit}>Create new Item</button>
        </div>
    );
  }
}

export default App;


