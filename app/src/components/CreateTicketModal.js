import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Form,
  //Tabs,
  //Tab,
  Button,
  //Row,
  //Col,
  //Container,
  //Table,
} from "react-bootstrap";
//import Spinner from "./Spinner";
import {
  accountSelector,
  ticketsLoadedSelector,
  ticketsSelector,
  marketplaceSelector,
  saleTogglingSelector,
  modalSelector,
  web3Selector,
} from "../store/selectors";
import { createTicket } from "../store/interactions";
import { closeModal } from "../store/actions";
import { CATEGORIES } from "../hardcodedConstants";

class CreateTicketModal extends Component {
  state = { price: null, seat: null, category: 0 };
  render() {
    return (
      <Modal show={true} onHide={(e) => this.props.dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title> Create Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group small">
              <label>Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Price"
                  onChange={(e) => (this.state.price = e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group small">
              <label>Seat</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Seat"
                  onChange={(e) => (this.state.seat = e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group small">
              <label>Category</label>
              {/* <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Category"
                  onChange={(e) => (this.state.category = e.target.value)}
                  required
                />
              </div> */}
              <div className="select-container">
                <Form.Control
                  as="select"
                  value={this.state.category}
                  // onChange={(e) => (this.state.category = e.target.value)}
                  onChange={(e) => this.setState({ category: e.target.value })}
                  style={{
                    backgroundColor: "#343a40",
                    height: "35px",
                    color: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  {Object.keys(CATEGORIES).map((key) => (
                    <option value={key} key={key}>
                      {CATEGORIES[key]}
                    </option>
                  ))}
                </Form.Control>
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
              createTicket(
                this.state.price,
                this.state.seat,
                this.state.category,
                this.props.marketplace,
                this.props.account,
                this.props.web3,
                this.props.dispatch
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
  };
}

export default connect(mapStateToProps)(CreateTicketModal);
