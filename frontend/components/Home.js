import React, { useEffect, useState } from "react";
import { Component } from "react"; // TODO remove this after delete App class

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  accountSelector,
  contractsLoadedSelector,
  isMarketplaceOwnerAccountSelector,
} from "../store/selectors";
// import { connect } from "react-redux";
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

const loadBlockchainData = async (props) => {
  const web3 = await props.loadWeb3();

  await props.loadAccount(web3);

  const networkId = await web3.eth.net.getId();

  const marketplace = await props.loadMarketplace(web3, networkId);
  if (!marketplace) {
    window.alert(
      "Marketplace smart contract not detected on the current network. Please select another network with Metamask."
    );
    return;
  }
  await props.loadMarketplaceState(marketplace);
};

const Home = (props) => {
  //TODO: do we need to manage these states here??
  // state = {
  //   web3
  //   networkId
  //   marketplace
  //   contractsLoaded
  // }
  // const [networkId, setNetworkId] = useState(null);

  useEffect(() => {
    loadBlockchainData(props);
  }, [props]);
  return <h1>hello from Home (former App ) function</h1>;
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  store.dispatch(loadWeb3());
  store.dispatch(loadAccount());
  store.dispatch(loadMarketplace);
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadWeb3: bindActionCreators(loadWeb3, dispatch),
    loadAccount: bindActionCreators(loadAccount, dispatch),
    loadMarketplace: bindActionCreators(loadMarketplace, dispatch),
    loadMarketplaceState: bindActionCreators(loadMarketplaceState, dispatch),
  };
};

// export default connect(null, mapDispatchToProps)(wrapper.withRedux(Home));

export default connect(null, mapDispatchToProps)(Home);
// export default Home;
// export default wrapper.withRedux(Home);

// export default wrapper.withRedux(connect(null, mapDispatchToProps)(Home));
