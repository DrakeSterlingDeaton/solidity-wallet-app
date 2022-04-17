var Migrations = artifacts.require("./Migrations.sol");
var Ownable = artifacts.require("./Ownable.sol")
// var Item = artifacts.require("./Item.sol");
var ItemManager = artifacts.require("./ItemManager.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(Ownable);
    // deployer.deploy(Item);
    deployer.deploy(ItemManager);
};