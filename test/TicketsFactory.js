const TicketsFactory = artifacts.require("TicketsFactory");
const utils = require("./helpers/utils");

contract("TicketsFactory", (accounts) => {
  let [owner, user] = accounts;
  let contractInstance;
  beforeEach(async() => {
    contractInstance = await TicketsFactory.new();
  });

  it("Owner should be able to create tickets", async() => {
    const result = await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    assert.equal(result.receipt.status, true);
    const ownerAddress = await contractInstance.ownerOf(0);
    assert.equal(ownerAddress, owner, "minted tokens now owned by owner");
    const balance = await contractInstance.balanceOf(owner);
    assert.equal(balance, 1, "owner only hold one token")
  });

  it("Normal user should not be able to create tickets", async() => {
    await utils.shouldThrow(contractInstance.createTicket(0, "", {from:user}));
  });

  it("All created tickets should be recorded on the blockchain", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    const result1 = await contractInstance.getOnSaleLength();
    const result2 = await contractInstance.getOwnersLength();
    assert.equal(result1, 1);
    assert.equal(result2, 1);
  });

  it("Ticket owner should be able to change ticket price", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    const result = await contractInstance.changeTicketPrice(0, web3.utils.toWei('3.1','ether'), "", {from:owner});
    assert.equal(result.receipt.status, true);
    const ticketPrice = await contractInstance.ticketPrice(0);
    assert.equal(web3.utils.toWei('3.1','ether'), ticketPrice, "ticket price correctly changed");
  });

  it("Ticket owner should not be able to change ticket price to higher than 10% of orginal price", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await utils.shouldThrow(contractInstance.changeTicketPrice(0, web3.utils.toWei('3.4','ether'), "", {from:owner}));
  });

  it("No one should be able to change ticket price except the ticket owner", async() => {
    await contractInstance.createTicket(web3.utils.toWei('3','ether'), "", {from:owner});
    await utils.shouldThrow(contractInstance.changeTicketPrice(0, web3.utils.toWei('3.1','ether'), "", {from:user}));
  });
})
