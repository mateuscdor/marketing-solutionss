import { HYDRATE } from "next-redux-wrapper";
import * as t from "../types";

const initialState = {
	redirectList: [],
	selectedRedirect: undefined,
	isModalOpen: false,
};

const mainReducer = (state = initialState, action) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload };
		case t.MODAL_OPEN:
			return {
				...state,
				isModalOpen: action.payload,
			};
		case t.REDIRECT_FETCH_SUCCEEDED:
			return {
				...state,
				redirectList: action.payload,
			};
		case t.REDIRECT_ADD_SUCCEEDED:
			return {
				...state,
				redirectList: [action.payload, ...state.redirectList],
			};
		case t.REDIRECT_UPDATE_SUCCEEDED:
			const updatedRedirect = state.redirectList.map((redirect) => {
				if (redirect.id === action.payload.id) {
					return {
						...redirect,
						name: action.payload.name,
						email: action.payload.email,
						address: action.payload.address,
						phone: action.payload.phone,
					};
				}
				return redirect;
			});

			return { ...state, redirectList: updatedRedirect };
		case t.REDIRECT_DELETE_SUCCEEDED:
			const newRedirectList = state.redirectList.filter(
				(redirect) => redirect.id !== action.payload
			);
			return {
				...state,
				redirectList: newRedirectList,
			};
		case t.REDIRECT_SELECTED:
			const selectedRedirect = state.redirectList.find(
				(redirect) => redirect.id === action.payload
			);
			return {
				...state,
				selectedRedirect,
			};
		default:
			return state;
	}
};

export default mainReducer;
