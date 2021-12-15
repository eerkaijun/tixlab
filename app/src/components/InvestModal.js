import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  accountSelector,
  ticketsSelector,
  marketplaceSelector,
  modalSelector,
  web3Selector,
  numTicketsSelector,
  investmentSoldSelector,
} from "../store/selectors";
import { changeTicketPrice, invest } from "../store/interactions";
import { closeModal } from "../store/actions";

class InvestModal extends Component {
  state = { collateralUnits: 0 };
  render() {
    // const ticket = this.props.modal.modal.data;
    const { numTickets, investmentSold } = this.props;

    return (
      <Modal show={true} onHide={(e) => this.props.dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title>Invest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group small">
              <label>Total units for collateral</label>
              <div className="input-group">
                <input
                  disabled={true}
                  placeholder={numTickets}
                  className="black-placeholder form-control form-control-sm bg-secondary text-white"
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Sold collateral units</label>
              <div className="input-group">
                <input
                  disabled={true}
                  placeholder={investmentSold}
                  className="black-placeholder form-control form-control-sm bg-secondary text-white"
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Available collateral units</label>
              <div className="input-group">
                <input
                  disabled={true}
                  // placeholder={ticket.ticket_value}
                  placeholder={numTickets - investmentSold}
                  className="black-placeholder form-control form-control-sm bg-secondary text-white"
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Collateral units to invest</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Units to invest"
                  onChange={(e) =>
                    (this.state.collateralUnits = e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={(e) => this.props.dispatch(closeModal())}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={(e) => {
              invest(
                this.props.dispatch,
                this.props.marketplace,
                this.props.web3,
                this.state.collateralUnits,
                this.props.account
              );
              this.props.dispatch(closeModal());
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    marketplace: marketplaceSelector(state),
    numTickets: numTicketsSelector(state),

    account: accountSelector(state),
    modal: modalSelector(state),
    web3: web3Selector(state),
    investmentSold: investmentSoldSelector(state),
  };
}

export default connect(mapStateToProps)(InvestModal);
