import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {  // When you have a Ethereum wallet application browser extension installed on your browser, every webpage you visit has it's JS window object
                              // injected with the ".ethereum" object, which this script is using to detect if the user has a wallet installed.
                              // The "ethereum" API here has been implemented by meta mask, and it allows websites to request user login, load data from blockchains the user has a connection to.

        const web3 = new Web3(window.ethereum); // Creating an instance of the Web3 API. Requires a provider (Metamask in this case)
        try {
          // Request account access if needed
          await window.ethereum.enable();   // The MetaMask provider won’t be populated with user accounts on page load.
                                            // To access user accounts and initiate account-requiring RPC calls, dapps must first call ethereum.enable()
                                            // This method returns a Promise that resolves to an array of user accounts once access is approved for a given dapp.
                                            // Once this approval happens, MetaMask will populate its injected provider with user accounts like normal.
          // Acccounts now exposed
          resolve(web3);    // returns the web3 API object
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
