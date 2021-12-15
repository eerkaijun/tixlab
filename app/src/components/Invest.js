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
  numTicketsSelector,
  investmentSoldSelector,
  investorUnitsSelector,
  investingSelector,
} from "../store/selectors";

import { openModal } from "../store/actions";

class Invest extends Component {
  render() {
    const { numTickets, investmentSold, investorUnits, investing } = this.props;
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Invest into the Event</div>

        {!investing ? (
          <div className="card-body">
            {/* creatingTickets, investmentStart, investmentStop, ticketSaleStart, eventStart  */}

            <div>Your collateral units: {investorUnits}</div>
            <p></p>

            <div>Total units for collateral: {numTickets}</div>
            <div>Sold collateral units: {investmentSold}</div>
            <div>Available collateral units: {numTickets - investmentSold}</div>
            <div>Investment price : 0.1 ETH per unit(ticket)</div>
            {numTickets - investmentSold > 0 ? (
              <Button
                variant="primary"
                onClick={(e) => this.props.dispatch(openModal("Invest"))}
                style={{ float: "right" }}
              >
                Invest
              </Button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <Spinner type="div-dark" />
        )}

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

    numTickets: numTicketsSelector(state),

    investmentSold: investmentSoldSelector(state),
    investorUnits: investorUnitsSelector(state),
    investing: investingSelector(state),
  };
}

export default connect(mapStateToProps)(Invest);
