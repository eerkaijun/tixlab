import Web3 from "web3";
import {
  web3Loaded,
  web3AccountLoaded,
  marketplaceLoaded,
  marketplaceStateChanging,
  marketplaceStateChanged,
  investmentSoldChanged,
  investorUnitsChanged,
  numTicketsLoaded,
  ticketsLoaded,
  saleToggling,
  saleToggled,
  investing,
  invested,
  ticketCreating,
  ticketCreated,
  ticketPriceChanging,
  ticketPriceChanged,
  ticketBuying,
  ticketBouhgt,
} from "./actions";
import Marketplace from "../contracts-json/Marketplace.json";
import { MARKETPLACE_STATES, CATEGORIES, COLORS } from "../hardcodedConstants";

// const ipfsClient = require("ipfs-http-client");

const ipfs = require("ipfs-http-client")({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
const axios = require("axios");

export const loadWeb3 = async (dispatch) => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      await window.ethereum.enable();
      dispatch(web3Loaded(web3));
      return web3;
    } catch (error) {
      // User denied account access...
      alert("Please connect Metamask to the site");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    const web3 = new Web3(web3.currentProvider);
    dispatch(web3Loaded(web3));
    return web3;
  }
  // Non-dapp browsers...
  else {
    window.alert("Please install MetaMask");
    window.location.assign("https://metamask.io/");
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  dispatch(web3AccountLoaded(account));
  return account;
};

export const loadMarketplace = async (web3, networkID, dispatch) => {
  try {
    const marketplace = await new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkID].address
    );
    dispatch(marketplaceLoaded(marketplace));
    // console.log("!!!!marketplace", marketplace);
    return marketplace;
  } catch (error) {
    console.log(
      "Contract not deployed to the current network. Please select another network with Metamask."
    );
    return null;
  }
};

export const createTicket_old = async (
  price,
  seat,
  category,
  marketplace,
  account,
  web3,
  dispatch
) => {
  let metadata = {
    seat_number: seat,
    ticket_category: category,
    ticket_value: price,
  };
  // console.log(JSON.stringify(metadata));
  let result = await ipfs.add(JSON.stringify(metadata));
  let maxPrice = parseInt(price) * 1.1;
  // console.log("IPFS hash: ", result.path);
  // console.log("!!!account", account);
  await marketplace.methods
    // .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
    .createTicket(
      web3.utils.toWei(price, "ether"),
      web3.utils.toWei(maxPrice.toString(), "ether"),
      result.path
    )
    .send({ from: account });
  // .on("transactionHash", (hash) => {
  //   dispatch(ticketCreating());
  // })
  // .on("error", (error) => {
  //   console.log(error);
  //   window.alert("There was an error!");
  // });
  console.log("Ticket created successfully!");

  //const num_tickets = await marketplace.methods.getOnSaleLength().call();
  //console.log("!!!!!num_tickets", num_tickets);
};

export const createTicket = async (
  price,
  seat,
  category,
  marketplace,
  account,
  web3,
  dispatch
) => {
  // let ticketText = `Seat: ${seat} \n Price: ${price} \n Category: ${category}`;

  let ticketText = `<tspan x="50%" dy="1.2em">Seat: ${seat}</tspan>
    <tspan x="50%" dy="1.2em">Category: ${CATEGORIES[category]}</tspan>
    <tspan x="50%" dy="1.2em">Price: ${price} </tspan>`;

  let encodedString = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
  <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
  <rect width="100%" height="100%" fill="${COLORS[category]}" />
  <text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">${ticketText}</text>
</svg>`
  ).toString("base64");
  let metadata = {
    seat_number: seat,
    ticket_category: category,
    ticket_value: price,
    attributes: [
      // {
      //   trait_type: "Breed",
      //   value: "Maltipoo",
      // },
      // {
      //   trait_type: "Eye color",
      //   value: "Mocha",
      // },
    ],
    description: `DApp Marketplace. Ticket seat# ${seat}`,
    image:
      // "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgIDxzdHlsZT4uYmFzZSB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgfTwvc3R5bGU+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+Cjwvc3ZnPg==",
      `data:image/svg+xml;base64,${encodedString}`,
    name: `Ticket seat# ${seat}`,
  };

  // {
  //   attributes: [
  //     {
  //       trait_type: "Breed",
  //       value: "Maltipoo",
  //     },
  //     {
  //       trait_type: "Eye color",
  //       value: "Mocha",
  //     },
  //   ],
  //   description: "The world's most adorable and sensitive pup.",
  //   image:
  //     "https://gateway.pinata.cloud/ipfs/QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb",
  //   name: "Ramses",
  // };

  // {
  //   seat_number: seat,
  //   ticket_category: category,
  //   ticket_value: price,
  //   // image: "data:image/svg+xml;base64"
  //   image:
  //     "https://ipfs.io/ipfs/QmQYE35JdthxvBZahG77w5XSuPKL2jNkJdtxQo4Pc57U1n",
  // };
  // console.log(JSON.stringify(metadata));
  let result = await ipfs.add(JSON.stringify(metadata));
  let maxPrice = parseInt(price) * 1.1;
  console.log("!!!!IPFS hash: ", result.path);
  // console.log("!!!account", account);
  await marketplace.methods
    // .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
    .createTicket(
      web3.utils.toWei(price, "ether"),
      web3.utils.toWei(maxPrice.toString(), "ether"),
      result.path
    )
    .send({ from: account });
  // .on("transactionHash", (hash) => {
  //   dispatch(ticketCreating());
  // })
  // .on("error", (error) => {
  //   console.log(error);
  //   window.alert("There was an error!");
  // });
  console.log("!!!!Ticket created successfully!");
  console.log("!!!!IPFS hash: ", result.path);

  //const num_tickets = await marketplace.methods.getOnSaleLength().call();
  //console.log("!!!!!num_tickets", num_tickets);
};

export const loadMarketplaceState = async (marketplace, dispatch) => {
  //TODO: create enum with marketplase.State
  //   enum State { creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart }
  // 0 = creatingTickets 1 = investmentStart... etc

  const marketplaceStateNum = await marketplace.methods.currentState
    .call((err, res) => res)
    .call();
  const marketplaceStateStr = Object.keys(MARKETPLACE_STATES).find(
    (key) => MARKETPLACE_STATES[key] == marketplaceStateNum
  );
  const marketplaceState = [marketplaceStateNum, marketplaceStateStr];

  // console.log("!!!!!marketplaceState ", marketplaceState);

  dispatch(marketplaceStateChanged(marketplaceState));
};

export const loadInvestorUnits = async (marketplace, account, dispatch) => {
  // console.log("!!!!!web3 ", web3);
  const investorUnits = await marketplace.methods
    .investors(account)
    // .investors("0x80BC2298872D8C88f0Eca80fA1a63953Ac3093F8")

    .call((err, res) => res);

  // console.log("!!!!!investorUnits ", investorUnits);

  dispatch(investorUnitsChanged(investorUnits));
};

export const loadInvestmentSold = async (marketplace, dispatch) => {
  // const investmentSold = await marketplace.methods._investmentSold;
  const investmentSold = await marketplace.methods._investmentSold
    .call((err, res) => res)
    .call();

  // console.log("!!!!!investmentSold ", investmentSold);

  dispatch(investmentSoldChanged(investmentSold));
};

export const loadAllTickets = async (marketplace, dispatch) => {
  const myTickets = [];
  const items = [];

  const num_tickets = await marketplace.methods.getTicketsLength().call();
  dispatch(numTicketsLoaded(num_tickets));
  // const num_tickets = 1;
  // console.log("!!!!!num_tickets", num_tickets);
  var uri, data, item, myTicket, ticket;
  for (let i = 0; i < num_tickets; i++) {
    ticket = await marketplace.methods.tickets(i).call();

    uri = await marketplace.methods.tokenURI(i).call();
    try {
      data = await axios.get(uri);
      myTicket = data.data;
      myTicket.ticket_id = i;
      myTicket.on_sale = ticket.onSale;
      myTickets.push(myTicket);
    } catch (error) {
      console.log(error);
    }
  }
  // console.log("!!!!!myTickets", myTickets);
  dispatch(ticketsLoaded(myTickets));
};

export const toggleSale = async (dispatch, marketplace, ticket, account) => {
  marketplace.methods
    .toggleSale(ticket.ticket_id)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(saleToggling(ticket));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startInvestment = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startInvestment()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when investmentStarted event is added to the smart contract
      console.log(
        "!!!!!startInvestment will call dispatch(marketplaceStateChanging());"
      );
      dispatch(marketplaceStateChanging());
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const stopInvestment = async (dispatch, marketplace, account) => {
  marketplace.methods
    .stopInvestment()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when investmentStarted event is added to the smart contract
      dispatch(marketplaceStateChanging());
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startTicketSale = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startTicketSale()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const startEvent = async (dispatch, marketplace, account) => {
  marketplace.methods
    .startEvent()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const retrieve = async (dispatch, marketplace, account) => {
  marketplace.methods
    .retrieve()
    .send({
      from: account,
    })
    .on("transactionHash", (hash) => {
      //TODO add dispatch(marketplaceStateChanging when startTicketSale event is added to the smart contract
      dispatch(marketplaceStateChanging(marketplace));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};

export const buyTicket = async (
  dispatch,
  marketplace,
  web3,
  ticket,
  account
) => {
  marketplace.methods
    .buyTicket(ticket.ticket_id)
    // .send({ from: account, value: ticket.ticket_value })
    .send({
      from: account,
      // value: 2,
      // value: ticket.ticket_value,
      value: web3.utils.toWei(ticket.ticket_value, "ether"),
    })
    .on("transactionHash", (hash) => {
      // dispatch(saleToggling(ticket));
    })
    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });
};
///////TODO instead of ticket.ticket_value call contract with  web3.utils.toWei(ticket.ticket_value,'ether'),
export const changeTicketPrice = async (
  dispatch,
  marketplace,
  web3,
  ticket,
  account
) => {
  let uri = await marketplace.methods.tokenURI(ticket.ticket_id).call();
  var item;
  try {
    let data = await axios.get(uri);
    item = data.data;
    item.ticket_value = ticket.ticket_value;
  } catch (error) {
    console.log(error);
  }
  let result = await ipfs.add(JSON.stringify(item));

  // console.log("!!!!! IPFS result: ", result);

  await marketplace.methods
    .changeTicketPrice(
      ticket.ticket_id,
      web3.utils.toWei(ticket.ticket_value, "ether"),
      result.path
    )
    .send({ from: account })
    .on("transactionHash", (hash) => {
      dispatch(ticketPriceChanging(ticket));
    });
  console.log("Ticket price changed successfully!");
};
///////////////////////////

export const invest = async (
  dispatch,
  marketplace,
  web3,
  collateralUnits,
  account
) => {
  //TODO replace 3 with actual value of collateral unit price when it's ready in the smart contract
  const investValue = collateralUnits * 3;
  await marketplace.methods
    .invest(collateralUnits)
    // .send({ from: account, value: web3.utils.toWei("30", "ether") })
    .send({
      from: account,
      value: web3.utils.toWei(investValue.toString(), "wei"),
    })

    .on("transactionHash", (hash) => {
      dispatch(investing());
    })

    .on("error", (error) => {
      console.log(error);
      window.alert("There was an error!");
    });

  console.log("invested successfully!");
};

export const subscribeToEvents = async (web3, marketplace, dispatch) => {
  marketplace.events.saleToggled({}, (error, event) => {
    dispatch(saleToggled(event.returnValues));
  });

  // invested(address _investor, uint _number);
  marketplace.events.invested({}, (error, event) => {
    // console.log(
    //   "!!!!!!! marketplace.events.invested subscription event:",
    //   event
    // );
    dispatch(invested());
  });

  marketplace.events.ticketCreated({}, (error, event) => {
    // console.log("!!!!marketplace.events.ticketCreated event: ", event);
    dispatch(ticketCreated(event.returnValues));
  });

  marketplace.events.investmentStarted({}, (error, event) => {
    // console.log("!!!!marketplace.events.investmentStarted event: ", event);
    dispatch(marketplaceStateChanged(["1", "investmentStart"]));
  });

  marketplace.events.investmentStopped({}, (error, event) => {
    // console.log("!!!!marketplace.events.investmentStopped event: ", event);
    dispatch(marketplaceStateChanged(["2", "investmentStop"]));
  });

  marketplace.events.ticketSaleStarted({}, (error, event) => {
    // console.log("!!!!marketplace.events.ticketSaleStarted event: ", event);
    dispatch(marketplaceStateChanged(["3", "ticketSaleStart"]));
  });
  marketplace.events.eventStarted({}, (error, event) => {
    // console.log("!!!!marketplace.events.eventStarted event: ", event);
    dispatch(marketplaceStateChanged(["4", "eventStart"]));
  });
  // TODO: add when investmentRetrieved event is added to the smart contract
  // marketplace.events.investmentRetrieved({}, (error, event) => {
  //   console.log("!!!!marketplace.events.investmentRetrieved event: ", event);
  //   dispatch(marketplaceStateChanged(["5", "investmentRetrieved"]));
  // });
};
