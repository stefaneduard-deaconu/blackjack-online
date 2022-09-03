import {createStore, applyMiddleware} from 'redux'
import RootReducer from "./reducers/RootReducer";
import {composeWithDevToolsDevelopmentOnly} from "@redux-devtools/extension";
import thunk from 'redux-thunk'

const store = createStore(RootReducer, composeWithDevToolsDevelopmentOnly(
    applyMiddleware(thunk)
))
export type RootStore = ReturnType<typeof RootReducer>


export default store;

