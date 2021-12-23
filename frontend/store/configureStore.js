import { createStore, applyMiddleware, compose } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thinkMiddleware from "redux-thunk";
import rootReducer from "./reducers";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const reduser = (state, action) => {
  if (action.type == HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

const initStore = () => {
  return createStore(reduser, bindMiddleware([thinkMiddleware]));
};

export const wrapper = createWrapper(initStore);
// export default function configureStore(preloadedState) {
//   return createStore(
//     rootReducer,
//     preloadedState,
//     composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
//   );
// }

// const loggerMiddleware = createLogger();
// const middleware = [];

// // For Redux Dev Tools
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default function configureStore(preloadedState) {
//   return createStore(
//     rootReducer,
//     preloadedState,
//     composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
//   );
// }
