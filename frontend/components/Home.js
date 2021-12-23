import React, { useEffect, useState } from "react";
import { Component } from "react"; // TODO remove this after delete App class
import {
  accountSelector,
  contractsLoadedSelector,
  isMarketplaceOwnerAccountSelector,
} from "../store/selectors";
import { connect } from "react-redux";
import {
  loadWeb3,
  loadAccount,
  loadMarketplace,
  loadMarketplaceState,
} from "../store/interactions";

import { wrapper } from "../store/configureStore";

// TODO : look lesson 17 and setup truffle-config to put build to ./src directory

import "../hardcodedConstants";
const ipfsClient = require("ipfs-http-client");
// const ipfs = require("ipfs-http-client")({
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  // host: "ipfs",
  port: "5001",
  protocol: "https",
});
// const axios = require("axios");
// const dispatch = {};
const loadBlockchainData = async (dispatch) => {
  const web3 = await loadWeb3(dispatch);
  console.log("!!!web3 : ", web3);
  await loadAccount(web3, dispatch);
  // console.log(
  //   "!!!!!! isMarketplaceOwnerAccount",
  //   this.props.isMarketplaceOwnerAccount
  // );

  const networkId = await web3.eth.net.getId();
  console.log("!!!networkId : ", networkId);
  const marketplace = await loadMarketplace(web3, networkId, dispatch);
  if (!marketplace) {
    window.alert(
      "Marketplace smart contract not detected on the current network. Please select another network with Metamask."
    );
    return;
  }
  await loadMarketplaceState(marketplace, dispatch);
};

function Home(props) {
  // state = {
  //   web3
  //   networkId
  //   marketplace
  //   contractsLoaded

  // }
  const [networkId, setNetworkId] = useState(4);

  useEffect(() => {
    loadBlockchainData();
  });
  return <h1>hello from Home (former App ) function</h1>;
}

class App extends Component {
  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch);

    // await this.createTicket("123", 8, 3);
    // await this.initMarketplace();
  }

  // async createTicket(price, seat, category) {
  //   let metadata = {
  //     seat_number: seat,
  //     ticket_category: category,
  //     ticket_value: price,
  //   };
  //   console.log(JSON.stringify(metadata));
  //   let result = await ipfs.add(JSON.stringify(metadata));

  //   console.log("IPFS hash: ", result.path);
  //   await this.contract.methods
  //     .createTicket(this.web3.utils.toWei(price, "ether"), result.path)
  //     .send({ from: this.account });
  //   console.log("Ticket created successfully!");

  //   // const num_tickets = await this.contract.methods.getOnSaleLength().call();
  // }

  async loadBlockchainData(dispatch) {
    const web3 = await loadWeb3(dispatch);
    await loadAccount(web3, dispatch);
    // console.log(
    //   "!!!!!! isMarketplaceOwnerAccount",
    //   this.props.isMarketplaceOwnerAccount
    // );
    const networkId = await web3.eth.net.getId();
    console.log("!!!networkId : ", networkId);
    const marketplace = await loadMarketplace(web3, networkId, dispatch);
    if (!marketplace) {
      window.alert(
        "Marketplace smart contract not detected on the current network. Please select another network with Metamask."
      );
      return;
    }
    await loadMarketplaceState(marketplace, dispatch);
  }

  render() {
    return (
      <div>
        {/* <Navbar /> */}
        {this.props.contractsLoaded ? (
          // <Content />
          <div className="content">this.props.contractsLoaded ...LOADED...</div>
        ) : (
          <div className="content">
            this.props.contractsLoaded ... NOT LOADED...
          </div>
        )}
      </div>
    );
  }
}

// export default Home;
export default wrapper.withRedux(Home);
