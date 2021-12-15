import React, { Component } from "react";
import { connect } from "react-redux";
import {
  //Modal,
  //Tabs,
  //Tab,
  Button,
  //Row,
  //Col,
  //Container,
  //Table,
} from "react-bootstrap";
import Spinner from "./Spinner";
import ChangePriceModal from "./ChangePriceModal";
import CreateTicketModal from "./CreateTicketModal";
import InvestModal from "./InvestModal";

import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
  modalSelector,
  ticketPriceChangingSelector,
  web3Selector,
  marketplaceStateSelector,
  marketplaceOwnerAccountSelector,
} from "../store/selectors";
import { toggleSale, buyTicket } from "../store/interactions";
//import { openModal, closeModal } from "../store/actions";
import { openModal } from "../store/actions";
import { CATEGORIES } from "../hardcodedConstants";

// const showTickets = (props, parentState, handleClose, handleShow) => {
const showTickets = (props, handleShow) => {
  const {
    tickets,
    dispatch,
    marketplace,
    account,
    web3,
    marketplaceState,
    marketplaceOwner,
  } = props;

  console.log("!!!!showTickets props", props);
  console.log("!!!!marketplace._address: ", marketplace._address);
  return (
    <tbody>
      {tickets.map((ticket, ind) => {
        // console.log("!!!!!Tickets marketplaceState: ", marketplaceState);
        return (
          <tr className={``} key={ticket.ticket_id}>
            <td>{ind}</td>
            <td>{ticket.seat_number}</td>
            <td>{ticket.ticket_value}</td>
            <td>{ticket.ticket_category}</td>
            <td>{ticket.ticket_id}</td>
            <td>{ticket.on_sale.toString()}</td>
            <td>
              {/* "https://testnets.opensea.io/assets/mumbai/0x4ed16b31e2d57aba2f3e81f0ba57b258e7efc5eb/0" */}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://testnets.opensea.io/assets/rinkeby/${marketplace._address}/${ticket.ticket_id}`}
              >
                NFT in OpenSea
              </a>
            </td>
            <td>
              {/* TODO use marketplaceState[1] to hide/show buttons depend on the marketplaceState
            creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}
              {ticket.on_sale && marketplaceState == "ticketSaleStart" ? (
                <Button
                  variant="primary"
                  onClick={(e) => {
                    buyTicket(dispatch, marketplace, web3, ticket, account);
                  }}
                  className="action-button"
                >
                  Buy Ticket
                </Button>
              ) : (
                <></>
              )}

              {marketplaceState === "ticketSaleStart" &&
              marketplaceOwner == account ? (
                <Button
                  variant="primary"
                  onClick={(e) => dispatch(openModal("ChangePrice", ticket))}
                  className="action-button"
                >
                  Change Price
                </Button>
              ) : (
                <></>
              )}

              {marketplaceState === "ticketSaleStart" &&
              marketplaceOwner == account ? (
                <Button
                  onClick={(e) => {
                    toggleSale(dispatch, marketplace, ticket, account);
                  }}
                  className="action-button"
                >
                  Toggle Sale
                </Button>
              ) : (
                <></>
              )}
              {/* <v-btn class="mx-2" dark color="green" v-on:click="toggleSale(props.item.ticket_id)"> */}
              {/* Toggle Sale */}
              {/* </v-btn> */}
              {/* async toggleSale(id) {
     await this.contract.methods.toggleSale(id).send({from:this.account});
      console.log("Ticket put on sale!"); */}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

class Tickets extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Tickets in the Marketplace</div>
        <div className="card-body">
          {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}

          {this.props.marketplaceState === "creatingTickets" &&
          this.props.marketplaceOwner == this.props.account ? (
            <Button
              variant="primary"
              onClick={(e) => this.props.dispatch(openModal("CreateTicket"))}
            >
              Create Ticket
            </Button>
          ) : (
            <div></div>
          )}

          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>#</th>
                <th>Seat Number</th>
                <th>Ticket Price (in ETH)</th>
                <th>Category</th>
                <th>Ticket ID</th>
                <th>On Sale</th>
                <th>OpenSea</th>
                <th>Actions</th>
              </tr>
            </thead>
            {this.props.ticketsLoaded ? (
              showTickets(
                this.props,
                // this.state,
                // this.handleClose,
                this.handleShow
              )
            ) : (
              <Spinner type="table" />
            )}
          </table>
        </div>

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "ChangePrice" ? (
          <ChangePriceModal />
        ) : (
          <div></div>
        )}

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "CreateTicket" ? (
          <CreateTicketModal />
        ) : (
          <div></div>
        )}

        {!!this.props.modal &&
        !!this.props.modal.modal &&
        this.props.modal.modal.type === "Invest" ? (
          <InvestModal />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const ticketsLoaded = ticketsLoadedSelector(state);
  const saleToggling = saleTogglingSelector(state);
  const ticketPriceChanging = ticketPriceChangingSelector(state);

  return {
    ticketsLoaded: ticketsLoaded && !saleToggling && !ticketPriceChanging,
    marketplace: marketplaceSelector(state),
    tickets: ticketsSelector(state),
    account: accountSelector(state),
    modal: modalSelector(state),
    web3: web3Selector(state),
    marketplaceState: marketplaceStateSelector(state)[1],
    marketplaceOwner: marketplaceOwnerAccountSelector(state),
  };
}

export default connect(mapStateToProps)(Tickets);
