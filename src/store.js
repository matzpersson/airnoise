import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducer from "./jsx/reducers";

import { createLogger } from 'redux-logger'

const middleware = applyMiddleware(promise(), thunk, createLogger());

export default createStore(reducer, middleware);
