const Marketplace = artifacts.require("Marketplace");
const utils = require("./helpers/utils");

contract("Marketplace", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await Marketplace.new();
  });

  it("User should be able to buy ticket when on sale", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    const result = await contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')});
    assert.equal(result.receipt.status, true);
    const contractBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(contractBalance, web3.utils.toWei('3','ether'), "contract received fund");
    const ownerAddress1 = await contractInstance.ownerOf(0);
    const ownerAddress2 = await contractInstance.owners(0);
    assert.equal(ownerAddress1, user, "minted tokens now owned by user");
    assert.equal(ownerAddress2, user, "minted tokens now owned by user");
    const ownerBalance = await contractInstance.balanceOf(owner);
    assert.equal(ownerBalance, 0, "owner doesn't hold any tokens anymore");
    const userBalance = await contractInstance.balanceOf(user);
    assert.equal(userBalance, 1, "user now hold one token");
  });

  it("Only the ticket owner should be able to put the ticket on sale", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await utils.shouldThrow(contractInstance.toggleSale(0, {from:user}));
  });

  it("User should not be able to buy ticket not on sale", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')}));
  });

  it("User should not be able to buy ticket below the price", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('2','ether')}));
  });

  it("User should not be able to buy ticket after event started", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    await contractInstance.startEvent({from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')}));
  });

  it("Seller should be able to withdraw money from contract", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await contractInstance.toggleSale(0, {from:owner});
    const result = await contractInstance.buyTicket(0, {from:user, value: web3.utils.toWei('3','ether')});
    assert.equal(result.receipt.status, true);
    await contractInstance.withdraw({from:owner});
  });

  it("User should not be able to buy more tickets than the maximum specified by the event organiser", async() => {
    var i;
    for (i=0; i<10; i++) {
      await contractInstance.createTicket(web3.utils.toWei('1','ether'), "", {from:owner});
      await contractInstance.toggleSale(i, {from:owner});
      await contractInstance.buyTicket(i, {from:user, value: web3.utils.toWei('1','ether')});
      const balance = await contractInstance.balanceOf(user);
      assert.equal(balance, i+1);
    }
    await contractInstance.createTicket(web3.utils.toWei('1','ether'), "", {from:owner});
    await contractInstance.toggleSale(10, {from:owner});
    await utils.shouldThrow(contractInstance.buyTicket(10, {from:user, value: web3.utils.toWei('1','ether')}));
  });

})
