import { combineReducers } from "redux";

function web3(state = {}, action) {
  switch (action.type) {
    case "WEB3_LOADED":
      return { ...state, connection: action.connection };
    case "WEB3_ACCOUNT_LOADED":
      return { ...state, account: action.account };
    default:
      return state;
  }
}

function marketplace(state = {}, action) {
  switch (action.type) {
    case "MARKETPLACE_LOADED":
      return { ...state, loaded: true, contract: action.contract };

    case "MARKETPLACE_STATE_CHANGING":
      return { ...state, marketplaceStateChanging: true };
    case "MARKETPLACE_STATE_CHANGED":
      return {
        ...state,
        marketplaceStateChanging: false,
        marketplaceState: action.marketplaceState,
      };

    case "INVESTMENT_SOLD_CHANGED":
      return { ...state, investmentSold: action.investmentSold };

    case "INVESTOR_UNITS_CHANGED":
      return { ...state, investorUnits: action.investorUnits };

    case "TICKETS_LOADED":
      return { ...state, tickets: { loaded: true, data: action.tickets } };
    case "NUM_TICKETS_LOADED":
      return { ...state, numTickets: action.numTickets };
    case "SALE_TOGGLING":
      return { ...state, saleToggling: true };

    case "SALE_TOGGLED":
      return {
        ...state,
        saleToggling: false,
        tickets: {
          ...state.tickets,

          data: state.tickets.data.map((ticket) =>
            ticket.ticket_id == action.ticket._id
              ? { ...ticket, on_sale: action.ticket.state }
              : ticket
          ),
        },
      };

    case "INVESTING":
      return { ...state, investing: true };

    case "INVESTED":
      // console.log("!!!!!!state.investmentSold: ", state.investmentSold);
      return {
        ...state,
        investing: false,
        // investmentSold: state.investmentSold + 1,
        // investmentSold: 444,
        // investorUnits: "8910",
      };

    case "TICKET_CREATING":
      return { ...state, ticketCreating: true };

    // case "TICKET_CREATED":
    //   console.log("!!!!!!ticket_created action.ticket", action.ticket);
    //   let createdTicket = {
    //     seat_number:
    //       "TODO: get from send request or return from smart contract",
    //     ticket_category: 0,
    //     ticket_value: action.ticket._price,
    //     ticket_id: action.ticket._id,
    //     on_sale: true,
    //   };

    //   return {
    //     ...state,
    //     ticketCreating: false,
    //     tickets: {
    //       ...state.tickets,

    //       // data: state.tickets.data.push(action.ticket),

    //       data: [...state.tickets.data, createdTicket],
    //     },
    //   };
    case "TICKET_PRICE_CHANGING":
      return { ...state, ticketPriceChanging: true };
    case "TICKET_PRICE_CHANGED":
      return {
        ...state,
        ticketPriceChanging: false,
        tickets: {
          ...state.tickets,

          data: state.tickets.data.map((ticket) =>
            ticket.ticket_id == action.ticket._id
              ? { ...ticket, ticket_value: action.ticket.ticket_value }
              : ticket
          ),
        },
      };
    default:
      return state;
  }
}

function modal(state = null, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, modal: { type: action.modal, data: action.data } };
    case "CLOSE_MODAL":
      return { ...state, modal: null };
    default:
      return state;
  }
}

// function exchange(state = {}, action) {
//   let index, data

//   switch (action.type) {
//     case 'EXCHANGE_LOADED':
//       return { ...state, loaded: true, contract: action.contract }
//     case 'CANCELLED_ORDERS_LOADED':
//       return { ...state, cancelledOrders: { loaded: true, data: action.cancelledOrders } }
//     case 'FILLED_ORDERS_LOADED':
//       return { ...state, filledOrders: { loaded: true, data: action.filledOrders } }
//     case 'ALL_ORDERS_LOADED':
//       return { ...state, allOrders: { loaded: true, data: action.allOrders } }
//     case 'ORDER_CANCELLING':
//       return { ...state, orderCancelling: true }
//     case 'ORDER_CANCELLED':
//       return {
//         ...state,
//         orderCancelling: false,
//         cancelledOrders: {
//           ...state.cancelledOrders,
//           data: [
//             ...state.cancelledOrders.data,
//             action.order
//           ]
//         }
//       }
//     case 'ORDER_FILLED':
//       // Prevent duplicate orders
//       index = state.filledOrders.data.findIndex(order => order.id === action.order.id);

//       if(index === -1) {
//         data = [...state.filledOrders.data, action.order]
//       } else {
//         data = state.filledOrders.data
//       }

//       return {
//         ...state,
//         orderFilling: false,
//         filledOrders: {
//           ...state.filledOrders,
//           data
//         }
//       }

//     case 'ORDER_FILLING':
//       return { ...state, orderFilling: true }

//     case 'EXCHANGE_ETHER_BALANCE_LOADED':
//       return { ...state, etherBalance: action.balance }
//     case 'EXCHANGE_TOKEN_BALANCE_LOADED':
//       return { ...state, tokenBalance: action.balance }
//     case 'BALANCES_LOADING':
//       return { ...state, balancesLoading: true }
//     case 'BALANCES_LOADED':
//       return { ...state, balancesLoading: false }
//     case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
//       return { ...state, etherDepositAmount: action.amount }
//     case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
//       return { ...state, etherWithdrawAmount: action.amount }
//     case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
//       return { ...state, tokenDepositAmount: action.amount }
//     case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
//       return { ...state, tokenWithdrawAmount: action.amount }

//     case 'BUY_ORDER_AMOUNT_CHANGED':
//       return { ...state, buyOrder: { ...state.buyOrder, amount: action.amount } }
//     case 'BUY_ORDER_PRICE_CHANGED':
//       return { ...state, buyOrder: { ...state.buyOrder, price: action.price } }
//     case 'BUY_ORDER_MAKING':
//       return { ...state, buyOrder: { ...state.buyOrder, amount: null, price: null, making: true } }

//     case 'ORDER_MADE':
//       // Prevent duplicate orders
//       index = state.allOrders.data.findIndex(order => order.id === action.order.id);

//       if(index === -1) {
//         data = [...state.allOrders.data, action.order]
//       } else {
//         data = state.allOrders.data
//       }

//       return {
//         ...state,
//         allOrders: {
//           ...state.allOrders,
//           data
//         },
//         buyOrder: {
//           ...state.buyOrder,
//           making: false
//         },
//         sellOrder: {
//           ...state.sellOrder,
//           making: false
//         }
//       }

//     case 'SELL_ORDER_AMOUNT_CHANGED':
//       return { ...state, sellOrder: { ...state.sellOrder, amount: action.amount } }
//     case 'SELL_ORDER_PRICE_CHANGED':
//       return { ...state, sellOrder: { ...state.sellOrder, price: action.price } }
//     case 'SELL_ORDER_MAKING':
//       return { ...state, sellOrder: { ...state.sellOrder, amount: null, price: null, making: true } }

//     default:
//       return state
//   }
// }

const rootReducer = combineReducers({
  web3,
  marketplace,
  modal,
});

export default rootReducer;
