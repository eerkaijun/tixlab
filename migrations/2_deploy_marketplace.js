const Marketplace = artifacts.require("Marketplace");
const web3 = require("web3");

module.exports = function (deployer) {
  deployer.deploy(Marketplace, web3.utils.toWei("3", "ether"));
};
