import { combineReducers } from "redux";
import redirectReducer from "./redirect";

const rootReducer = combineReducers({
	redirect: redirectReducer,
});

export default rootReducer;
