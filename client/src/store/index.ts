import {createStore, combineReducers, applyMiddleware} from "redux";
import {reducer} from "../reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import promise from "redux-promise-middleware";

export const rootReducer = combineReducers({reducer});

export type RootState = ReturnType<typeof rootReducer>;

const middleware = applyMiddleware(ReduxThunk, promise);

export const store = createStore(rootReducer, composeWithDevTools(middleware));

export default store;
