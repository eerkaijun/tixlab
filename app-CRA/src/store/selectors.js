// import { get, groupBy, reject, maxBy, minBy } from "lodash";
import { get } from "lodash";
import { createSelector } from "reselect";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import { ETHER_ADDRESS, GREEN, RED, ether, tokens } from '../helpers'
import { MARKETPLACE_OWNER_ACCOUNT, CATEGORIES } from "../hardcodedConstants";

const account = (state) => get(state, "web3.account");
export const accountSelector = createSelector(account, (a) => a);

const marketplaceState = (state) =>
  get(state, "marketplace.marketplaceState", [null, null]);
export const marketplaceStateSelector = createSelector(
  marketplaceState,
  (m) => m
);

const investmentSold = (state) => get(state, "marketplace.investmentSold", 0);
export const investmentSoldSelector = createSelector(investmentSold, (s) => s);

const investorUnits = (state) => get(state, "marketplace.investorUnits", 0);
export const investorUnitsSelector = createSelector(investorUnits, (s) => s);

const numTickets = (state) => get(state, "marketplace.numTickets", null);
export const numTicketsSelector = createSelector(numTickets, (n) => n);

// const marketplaceOwnerAccount = (state) =>
//   get(state, "marketplaceOwnerAccount");
const marketplaceOwnerAccount = () => {
  return MARKETPLACE_OWNER_ACCOUNT;
};
export const marketplaceOwnerAccountSelector = createSelector(
  marketplaceOwnerAccount,
  (a) => a
);
const isMarketplaceOwnerAccount = (state) => {
  return MARKETPLACE_OWNER_ACCOUNT == get(state, "web3.account");
};
export const isMarketplaceOwnerAccountSelector = createSelector(
  isMarketplaceOwnerAccount,
  (a) => a
);

const web3 = (state) => get(state, "web3.connection");
export const web3Selector = createSelector(web3, (w) => w);

const marketplaceLoaded = (state) => get(state, "marketplace.loaded", false);
export const marketplaceLoadedSelector = createSelector(
  marketplaceLoaded,
  (ml) => ml
);

const marketplace = (state) => get(state, "marketplace.contract");
export const marketplaceSelector = createSelector(marketplace, (m) => m);

export const contractsLoadedSelector = createSelector(
  marketplaceLoaded,
  (ml) => ml
);

const ticketsLoaded = (state) =>
  get(state, "marketplace.tickets.loaded", false);
export const ticketsLoadedSelector = createSelector(ticketsLoaded, (tl) => tl);

const tickets = (state) => get(state, "marketplace.tickets.data", []);
export const ticketsSelector = createSelector(tickets, (tickets) => {
  // Sort orders by date ascending for price comparison
  tickets = tickets.sort((a, b) => b.ticket_id - a.ticket_id);
  tickets = tickets.map((ticket) => {
    return { ...ticket, ticket_category: CATEGORIES[ticket.ticket_category] };
  });
  // console.log("!!!tick", tickets);
  return tickets;
});

const saleToggling = (state) => get(state, "marketplace.saleToggling", false);
export const saleTogglingSelector = createSelector(
  saleToggling,
  (status) => status
);

const investing = (state) => get(state, "marketplace.investing", false);
export const investingSelector = createSelector(investing, (status) => status);

const marketplaceStateChanging = (state) =>
  get(state, "marketplace.marketplaceStateChanging", false);
export const marketplaceStateChangingSelector = createSelector(
  marketplaceStateChanging,
  (status) => status
);

const ticketPriceChanging = (state) =>
  get(state, "marketplace.ticketPriceChanging", false);
export const ticketPriceChangingSelector = createSelector(
  ticketPriceChanging,
  (status) => status
);

const modal = (state) => get(state, "modal", null);
export const modalSelector = createSelector(modal, (modal) => modal);

///////////////////////////////////////////////

// const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
// export const filledOrdersSelector = createSelector(
//   filledOrders,
//   (orders) => {
//     // Sort orders by date ascending for price comparison
//     orders = orders.sort((a,b) => a.timestamp - b.timestamp)
//     // Decorate the orders
//     orders = decorateFilledOrders(orders)
//     // Sort orders by date descending for display
//     orders = orders.sort((a,b) => b.timestamp - a.timestamp)
//     return orders
//   }
// )
