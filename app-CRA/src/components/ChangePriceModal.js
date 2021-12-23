import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import {
  accountSelector,
  ticketsSelector,
  marketplaceSelector,
  modalSelector,
  web3Selector,
} from "../store/selectors";
import { changeTicketPrice } from "../store/interactions";
import { closeModal } from "../store/actions";

class ChangePriceModal extends Component {
  state = { price: null };
  render() {
    const ticket = this.props.modal.modal.data;

    return (
      <Modal show={true} onHide={(e) => this.props.dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title>Change Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group small">
              <label>Old price</label>
              <div className="input-group">
                <input
                  disabled={true}
                  placeholder={ticket.ticket_value}
                  className="form-control form-control-sm bg-dark text-white"
                />
              </div>
            </div>
            <div className="form-group small">
              <label>New Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Price"
                  onChange={(e) => (this.state.price = e.target.value)}
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
              changeTicketPrice(
                this.props.dispatch,
                this.props.marketplace,
                this.props.web3,
                {
                  ...ticket,
                  ticket_value: this.state.price,
                },
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
    tickets: ticketsSelector(state),
    account: accountSelector(state),
    modal: modalSelector(state),
    web3: web3Selector(state),
    // setShow: this.setShow,
  };
}

export default connect(mapStateToProps)(ChangePriceModal);
