import {combineReducers} from "redux";
import matchReducer from "./matchReducer";

const RootReducer = combineReducers({
    match: matchReducer
})

export default RootReducer;