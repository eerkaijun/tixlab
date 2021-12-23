import React, { Component } from "react";
import { connect } from "react-redux";
import {
  accountSelector,
  isMarketplaceOwnerAccountSelector,
} from "../store/selectors";

function Navbar(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="#/">
        Tickets DApp
      </a>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link small"
            // href={`https://etherscan.io/address/${this.props.account}`}
            // target="_blank"
            // rel="noopener noreferrer"
          >
            {/* {this.props.isMarketplaceOwnerAccount
              ? this.props.account + " Marketplase Owner "
              : this.props.account} */}
            TODO: Marketplase Owner put here
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
