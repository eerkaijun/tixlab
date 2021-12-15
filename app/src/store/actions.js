// WEB3
export function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

export function web3AccountLoaded(account) {
  return {
    type: "WEB3_ACCOUNT_LOADED",
    account,
  };
}

export function marketplaceStateChanging() {
  return {
    type: "MARKETPLACE_STATE_CHANGING",
  };
}

export function marketplaceStateChanged(marketplaceState) {
  return {
    type: "MARKETPLACE_STATE_CHANGED",
    marketplaceState,
  };
}

export function investing() {
  return {
    type: "INVESTING",
  };
}

export function invested() {
  console.log("!!!!!!! action invested called");
  return {
    type: "INVESTED",
  };
}

export function investmentSoldChanged(investmentSold) {
  return {
    type: "INVESTMENT_SOLD_CHANGED",
    investmentSold,
  };
}

export function investorUnitsChanged(investorUnits) {
  return {
    type: "INVESTOR_UNITS_CHANGED",
    investorUnits,
  };
}

export function marketplaseOwnerAccountLoaded(account) {
  return {
    type: "MARKETPLACE_OWNER_ACCOUNT_LOADED",
    account,
  };
}

// MARKETPLACE
export function marketplaceLoaded(contract) {
  return {
    type: "MARKETPLACE_LOADED",
    contract,
  };
}

export function numTicketsLoaded(numTickets) {
  return {
    type: "NUM_TICKETS_LOADED",
    numTickets,
  };
}
export function ticketsLoaded(tickets) {
  return {
    type: "TICKETS_LOADED",
    tickets,
  };
}

// Toggle sale
export function saleToggling(ticket) {
  return {
    type: "SALE_TOGGLING",
    ticket,
  };
}

export function saleToggled(ticket) {
  return {
    type: "SALE_TOGGLED",
    ticket,
  };
}
// Create Ticket
export function ticketCreating() {
  return {
    type: "TICKET_CREATING",
  };
}

export function ticketCreated(ticket) {
  return {
    type: "TICKET_CREATED",
    ticket,
  };
}

export function openModal(modal, data) {
  return {
    type: "OPEN_MODAL",
    modal,
    data,
  };
}
export function closeModal() {
  return {
    type: "CLOSE_MODAL",
  };
}
export function ticketPriceChanging(ticket) {
  // console.log("TICKET_PRICE_CHANGING ticket", ticket);
  return {
    type: "TICKET_PRICE_CHANGING",
    ticket,
  };
}
export function ticketPriceChanged(ticket) {
  // console.log("TICKET_PRICE_CHANGED ticket", ticket);
  return {
    type: "TICKET_PRICE_CHANGED",
    ticket,
  };
}
